import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApolloLink, CombinedGraphQLErrors, gql } from '@apollo/client';
import { Observable } from '@apollo/client/utilities';
import useStore from '@/services/store/useStore';
import { setAccessToken, getAccessToken, refreshSession, errorLink } from './client';

const GET_ME = gql`
  query GetMe {
    me {
      id
    }
  }
`;

const LOGIN = gql`
  mutation Login {
    login {
      token
    }
  }
`;

describe('access token', () => {
  it('set then get returns the same value', () => {
    setAccessToken('abc123');
    expect(getAccessToken()).toBe('abc123');
  });

  it('null clears the token', () => {
    setAccessToken('abc123');
    setAccessToken(null);
    expect(getAccessToken()).toBeNull();
  });
});

describe('refreshSession', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    setAccessToken(null);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('on success, sets the access token and resolves the session', async () => {
    const session = { token: 'new-token', user: { id: '1', firstName: 'Ada', lastName: 'L', email: 'a@b.com' } };
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ data: { refreshToken: session } }),
    } as Response);

    const result = await refreshSession();

    expect(result).toEqual(session);
    expect(getAccessToken()).toBe('new-token');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('op=RefreshToken'),
      expect.objectContaining({ method: 'POST', credentials: 'include' })
    );
  });

  it('on network failure, clears the access token and resolves null', async () => {
    setAccessToken('stale-token');
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'));

    const result = await refreshSession();

    expect(result).toBeNull();
    expect(getAccessToken()).toBeNull();
  });

  it('dedupes concurrent calls into a single fetch', async () => {
    const session = { token: 'new-token', user: { id: '1', firstName: 'Ada', lastName: 'L', email: 'a@b.com' } };
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ data: { refreshToken: session } }),
    } as Response);
    global.fetch = fetchMock;

    const [first, second] = await Promise.all([refreshSession(), refreshSession()]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(first).toEqual(session);
    expect(second).toEqual(session);
  });
});

describe('errorLink UNAUTHENTICATED handling', () => {
  const originalFetch = global.fetch;

  const unauthenticatedError = () =>
    new CombinedGraphQLErrors(
      {},
      [{ message: 'Not authenticated', extensions: { code: 'UNAUTHENTICATED' } }]
    );

  beforeEach(() => {
    setAccessToken(null);
    useStore.getState().login({ id: '1', firstName: 'Ada', lastName: 'L', email: 'a@b.com' });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  function run(link: ApolloLink, query = GET_ME) {
    return new Promise((resolve, reject) => {
      const results: unknown[] = [];
      ApolloLink.execute(link, { query }, { client: {} as never }).subscribe({
        next: (value) => results.push(value),
        error: (err) => reject(Object.assign(err, { results })),
        complete: () => resolve(results),
      });
    });
  }

  it('refreshes and retries once on UNAUTHENTICATED, succeeding on retry', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        data: { refreshToken: { token: 'new-token', user: { id: '1', firstName: 'Ada', lastName: 'L', email: 'a@b.com' } } },
      }),
    } as Response);

    let calls = 0;
    const mockLink = new ApolloLink((operation) => {
      calls += 1;
      if (!operation.getContext().retried) {
        return new Observable((observer) => observer.error(unauthenticatedError()));
      }
      return new Observable((observer) => {
        observer.next({ data: { me: { id: '1' } } });
        observer.complete();
      });
    });

    const results = await run(ApolloLink.from([errorLink, mockLink]));

    expect(calls).toBe(2);
    expect(results).toEqual([{ data: { me: { id: '1' } } }]);
    expect(getAccessToken()).toBe('new-token');
  });

  it('retries exactly once (no infinite loop) when the retried request is still UNAUTHENTICATED', async () => {
    // Documents the actual current behavior: the retry goes through `forward(operation)`,
    // which calls the next link directly and does NOT re-enter errorLink's onError handler
    // (see ErrorLink's implementation - only the *first* forward().subscribe() is wrapped).
    // So `operation.getContext().retried` is set but never read back by a live errorHandler
    // call, and the "still unauthenticated after retry" logout branch (client.ts:87-90) is
    // unreachable in practice. There's no infinite loop, but the store is also NOT logged
    // out on a persistent auth failure - it silently stays isAuthenticated: true.
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        data: { refreshToken: { token: 'new-token', user: { id: '1', firstName: 'Ada', lastName: 'L', email: 'a@b.com' } } },
      }),
    } as Response);

    let calls = 0;
    const mockLink = new ApolloLink(() => {
      calls += 1;
      return new Observable((observer) => observer.error(unauthenticatedError()));
    });

    await expect(run(ApolloLink.from([errorLink, mockLink]))).rejects.toBeInstanceOf(CombinedGraphQLErrors);

    expect(calls).toBe(2);
    expect(useStore.getState().isAuthenticated).toBe(true);
  });

  it('logs out but still retries once when the refresh itself fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'));

    let calls = 0;
    const mockLink = new ApolloLink((operation) => {
      calls += 1;
      if (!operation.getContext().retried) {
        return new Observable((observer) => observer.error(unauthenticatedError()));
      }
      return new Observable((observer) => {
        observer.next({ data: { me: null } });
        observer.complete();
      });
    });

    await run(ApolloLink.from([errorLink, mockLink]));

    expect(calls).toBe(2);
    expect(useStore.getState().isAuthenticated).toBe(false);
  });

  it('does not refresh or retry for AUTH_OPERATIONS like Login', async () => {
    global.fetch = vi.fn();

    let calls = 0;
    const mockLink = new ApolloLink(() => {
      calls += 1;
      return new Observable((observer) => observer.error(unauthenticatedError()));
    });

    await expect(run(ApolloLink.from([errorLink, mockLink]), LOGIN)).rejects.toBeInstanceOf(
      CombinedGraphQLErrors
    );

    expect(calls).toBe(1);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('passes through non-UNAUTHENTICATED GraphQL errors untouched', async () => {
    global.fetch = vi.fn();

    const otherError = new CombinedGraphQLErrors({}, [{ message: 'Boom', extensions: { code: 'BAD_INPUT' } }]);
    const mockLink = new ApolloLink(() => new Observable((observer) => observer.error(otherError)));

    await expect(run(ApolloLink.from([errorLink, mockLink]))).rejects.toBe(otherError);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
