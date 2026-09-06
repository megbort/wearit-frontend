import { beforeEach, describe, expect, it } from 'vitest';
import useStore from './useStore';
import type { CartItem } from '@/services/models/cart';

const initialState = useStore.getState();

beforeEach(() => {
  useStore.setState(initialState, true);
});

const productA = { name: 'Tee', price: 20, image: 'tee.jpg' };
const productB = { name: 'Hoodie', price: 50, image: 'hoodie.jpg' };

describe('cart state', () => {
  it('addItem adds a new item defaulting quantity to 1', () => {
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: productA });
    expect(useStore.getState().cart).toEqual([
      { productId: 'p1', size: 'M', color: 'red', quantity: 1, product: productA },
    ]);
  });

  it('addItem respects an explicit quantity', () => {
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: productA }, 3);
    expect(useStore.getState().cart[0].quantity).toBe(3);
  });

  it('addItem increments quantity when productId+size+color already in cart', () => {
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: productA });
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: productA }, 2);
    expect(useStore.getState().cart).toHaveLength(1);
    expect(useStore.getState().cart[0].quantity).toBe(3);
  });

  it('addItem treats a different size or color as a separate line', () => {
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: productA });
    useStore.getState().addItem({ productId: 'p1', size: 'L', color: 'red', product: productA });
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'blue', product: productA });
    expect(useStore.getState().cart).toHaveLength(3);
  });

  it('removeItem removes only the matching productId+size+color line', () => {
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: productA });
    useStore.getState().addItem({ productId: 'p2', size: 'L', color: 'blue', product: productB });
    useStore.getState().removeItem('p1', 'M', 'red');
    expect(useStore.getState().cart).toEqual([
      { productId: 'p2', size: 'L', color: 'blue', quantity: 1, product: productB },
    ]);
  });

  it('removeItem is a no-op when the item is not in the cart', () => {
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: productA });
    useStore.getState().removeItem('nope', 'M', 'red');
    expect(useStore.getState().cart).toHaveLength(1);
  });

  it('updateQuantity sets the quantity of the matching line', () => {
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: productA });
    useStore.getState().updateQuantity('p1', 'M', 'red', 5);
    expect(useStore.getState().cart[0].quantity).toBe(5);
  });

  it('setCart replaces the whole cart', () => {
    const cart: CartItem[] = [
      { productId: 'p1', size: 'M', color: 'red', quantity: 2, product: productA },
    ];
    useStore.getState().addItem({ productId: 'p2', size: 'L', color: 'blue', product: productB });
    useStore.getState().setCart(cart);
    expect(useStore.getState().cart).toEqual(cart);
  });

  it('clearCart empties the cart', () => {
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: productA });
    useStore.getState().clearCart();
    expect(useStore.getState().cart).toEqual([]);
  });
});

describe('auth state', () => {
  const user = { id: '1', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' };

  it('login sets user and isAuthenticated', () => {
    useStore.getState().login(user);
    expect(useStore.getState().user).toEqual(user);
    expect(useStore.getState().isAuthenticated).toBe(true);
  });

  it('setUser sets user and isAuthenticated', () => {
    useStore.getState().setUser(user);
    expect(useStore.getState().user).toEqual(user);
    expect(useStore.getState().isAuthenticated).toBe(true);
  });

  it('logout clears user, isAuthenticated, and the cart', () => {
    useStore.getState().login(user);
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: productA });
    useStore.getState().logout();
    expect(useStore.getState().user).toBeNull();
    expect(useStore.getState().isAuthenticated).toBe(false);
    expect(useStore.getState().cart).toEqual([]);
  });
});

describe('persist partialize', () => {
  it('persists user, isAuthenticated, and cart, not transient state', () => {
    const persistOptions = (useStore as unknown as {
      persist: { getOptions: () => { partialize: (state: ReturnType<typeof useStore.getState>) => object } };
    }).persist.getOptions();

    useStore.getState().login({ id: '1', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' });
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: productA });
    useStore.getState().setProducts([{ id: 'p1' } as never]);
    useStore.getState().setNotification({ message: 'hi', severity: 'info' });
    useStore.getState().setLoading(true);

    const persisted = persistOptions.partialize(useStore.getState());

    expect(persisted).toEqual({
      user: useStore.getState().user,
      isAuthenticated: true,
      cart: useStore.getState().cart,
    });
  });
});
