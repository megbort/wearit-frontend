import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useStore from '../services/store/useStore';

const mutate = vi.fn();
const query = vi.fn();
const clearStore = vi.fn();
const setAccessToken = vi.fn();
const getAccessToken = vi.fn();

vi.mock('../services/apollo/client', () => ({
  default: {
    mutate: (...args: unknown[]) => mutate(...args),
    query: (...args: unknown[]) => query(...args),
    clearStore: (...args: unknown[]) => clearStore(...args),
  },
  setAccessToken: (...args: unknown[]) => setAccessToken(...args),
  getAccessToken: (...args: unknown[]) => getAccessToken(...args),
}));

const { useLogin, useLogout, useMe } = await import('./useAuth');

const user = { id: '1', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', cart: [] };
const initialState = useStore.getState();

beforeEach(() => {
  useStore.setState(initialState, true);
  mutate.mockReset();
  query.mockReset();
  clearStore.mockReset();
  setAccessToken.mockReset();
  getAccessToken.mockReset();
});

describe('useLogin', () => {
  it('sets the access token and logs the user into the store on success', async () => {
    mutate.mockResolvedValue({ data: { login: { token: 'tok-1', user } } });
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.login('ada@example.com', 'password');
    });

    expect(setAccessToken).toHaveBeenCalledWith('tok-1');
    expect(useStore.getState().user).toEqual(user);
    expect(useStore.getState().isAuthenticated).toBe(true);
  });

  it('leaves the store unauthenticated and rethrows on failure', async () => {
    mutate.mockRejectedValue(new Error('bad credentials'));
    const { result } = renderHook(() => useLogin());

    await expect(
      act(async () => {
        await result.current.login('ada@example.com', 'wrong');
      })
    ).rejects.toThrow('bad credentials');

    expect(setAccessToken).not.toHaveBeenCalled();
    expect(useStore.getState().isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('toggles loading true then false around the call', async () => {
    let resolveMutate: (value: unknown) => void;
    mutate.mockReturnValue(new Promise((resolve) => { resolveMutate = resolve; }));
    const { result } = renderHook(() => useLogin());

    let loginPromise: Promise<unknown>;
    act(() => {
      loginPromise = result.current.login('ada@example.com', 'password');
    });

    await waitFor(() => expect(useStore.getState().isLoading).toBe(true));

    await act(async () => {
      resolveMutate({ data: { login: { token: 'tok-1', user } } });
      await loginPromise;
    });

    expect(useStore.getState().isLoading).toBe(false);
  });
});

describe('useLogout', () => {
  it('clears the token, resets store auth state, and clears the Apollo store', async () => {
    useStore.getState().login(user);
    mutate.mockResolvedValue({ data: { logout: true } });

    const { result } = renderHook(() => useLogout());
    await act(async () => {
      await result.current.logout();
    });

    expect(setAccessToken).toHaveBeenCalledWith(null);
    expect(useStore.getState().user).toBeNull();
    expect(useStore.getState().isAuthenticated).toBe(false);
    expect(clearStore).toHaveBeenCalled();
  });

  it('still clears local state and calls clearStore even if the mutation rejects', async () => {
    useStore.getState().login(user);
    mutate.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useLogout());
    await act(async () => {
      await result.current.logout();
    });

    expect(setAccessToken).toHaveBeenCalledWith(null);
    expect(useStore.getState().isAuthenticated).toBe(false);
    expect(clearStore).toHaveBeenCalled();
  });
});

describe('useMe', () => {
  it('returns null without querying when there is no access token', async () => {
    getAccessToken.mockReturnValue(null);
    const { result } = renderHook(() => useMe());

    const me = await act(async () => result.current.getCurrentUser());

    expect(me).toBeNull();
    expect(query).not.toHaveBeenCalled();
  });

  it('updates the store user on a successful query', async () => {
    getAccessToken.mockReturnValue('tok-1');
    query.mockResolvedValue({ data: { me: user } });
    const { result } = renderHook(() => useMe());

    const me = await act(async () => result.current.getCurrentUser());

    expect(me).toEqual(user);
    expect(useStore.getState().user).toEqual(user);
  });

  it('logs out when the query fails', async () => {
    useStore.getState().login(user);
    getAccessToken.mockReturnValue('tok-1');
    query.mockRejectedValue(new Error('unauthorized'));

    const { result } = renderHook(() => useMe());
    await act(async () => {
      await result.current.getCurrentUser();
    });

    expect(useStore.getState().isAuthenticated).toBe(false);
  });
});
