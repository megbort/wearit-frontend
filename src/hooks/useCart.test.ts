import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useStore from '../services/store/useStore';
import type { Product } from '../services/models/product';

const mutate = vi.fn();
const query = vi.fn();

vi.mock('../services/apollo/client', () => ({
  default: {
    mutate: (...args: unknown[]) => mutate(...args),
    query: (...args: unknown[]) => query(...args),
  },
}));

const { useCart, mergeGuestCartOnLogin, loadServerCart } = await import('./useCart');

const product: Product = {
  id: 'p1',
  sku: 'SKU1',
  name: 'Tee',
  price: 20,
  images: ['tee.jpg'],
  colors: ['red'],
  sizes: ['M'],
  details: [],
};

const initialState = useStore.getState();

beforeEach(() => {
  useStore.setState(initialState, true);
  mutate.mockReset();
  query.mockReset();
});

describe('useCart (guest)', () => {
  it('addItem updates the local store without calling the API', async () => {
    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.addItem(product, 'M', 'red');
    });

    expect(mutate).not.toHaveBeenCalled();
    expect(useStore.getState().cart).toEqual([
      { productId: 'p1', size: 'M', color: 'red', quantity: 1, product: { name: 'Tee', price: 20, effectivePrice: 20, image: 'tee.jpg' } },
    ]);
  });

  it('removeItem updates the local store without calling the API', async () => {
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: { name: 'Tee', price: 20, effectivePrice: 20, image: 'tee.jpg' } });
    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.removeItem('p1', 'M', 'red');
    });

    expect(mutate).not.toHaveBeenCalled();
    expect(useStore.getState().cart).toEqual([]);
  });
});

describe('useCart (authenticated)', () => {
  beforeEach(() => {
    useStore.getState().login({ id: 'u1', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' });
  });

  it('addItem calls the mutation and sets the store from the enriched response', async () => {
    mutate.mockResolvedValue({ data: { addToCart: [{ productId: 'p1', size: 'M', color: 'red', quantity: 1 }] } });
    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.addItem(product, 'M', 'red');
    });

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { productId: 'p1', size: 'M', color: 'red', quantity: 1 } })
    );
    expect(query).not.toHaveBeenCalled(); // snapshot already known from the product arg
    expect(useStore.getState().cart).toEqual([
      { productId: 'p1', size: 'M', color: 'red', quantity: 1, product: { name: 'Tee', price: 20, effectivePrice: 20, image: 'tee.jpg' } },
    ]);
  });

  it('addItem snapshots the discounted effectivePrice for a sale product', async () => {
    mutate.mockResolvedValue({ data: { addToCart: [{ productId: 'p3', size: 'M', color: 'red', quantity: 1 }] } });
    const saleProduct: Product = { ...product, id: 'p3', price: 100, sale: true, discountPercent: 20, effectivePrice: 80 };
    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.addItem(saleProduct, 'M', 'red');
    });

    expect(useStore.getState().cart).toEqual([
      { productId: 'p3', size: 'M', color: 'red', quantity: 1, product: { name: 'Tee', price: 100, effectivePrice: 80, image: 'tee.jpg' } },
    ]);
  });

  it('removeItem fetches missing product details for lines it does not already know', async () => {
    mutate.mockResolvedValue({ data: { removeFromCart: [{ productId: 'p2', size: 'L', color: 'blue', quantity: 2 }] } });
    query.mockResolvedValue({ data: { product: { id: 'p2', name: 'Hoodie', price: 50, images: ['hoodie.jpg'] } } });
    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.removeItem('p1', 'M', 'red');
    });

    expect(useStore.getState().cart).toEqual([
      { productId: 'p2', size: 'L', color: 'blue', quantity: 2, product: { name: 'Hoodie', price: 50, effectivePrice: 50, image: 'hoodie.jpg' } },
    ]);
  });

  it('surfaces an error notification and rethrows when the mutation fails', async () => {
    mutate.mockRejectedValue(new Error('network error'));
    const { result } = renderHook(() => useCart());

    await expect(
      act(async () => {
        await result.current.addItem(product, 'M', 'red');
      })
    ).rejects.toThrow('network error');

    expect(useStore.getState().notification).toEqual({
      message: 'Could not add item to cart',
      severity: 'error',
    });
  });
});

describe('mergeGuestCartOnLogin', () => {
  it('does nothing when the guest cart is empty', async () => {
    await mergeGuestCartOnLogin();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('replays each guest line as addToCart and sets the store from the final response', async () => {
    useStore.getState().addItem({ productId: 'p1', size: 'M', color: 'red', product: { name: 'Tee', price: 20, effectivePrice: 20, image: 'tee.jpg' } }, 2);
    useStore.getState().addItem({ productId: 'p2', size: 'L', color: 'blue', product: { name: 'Hoodie', price: 50, effectivePrice: 50, image: 'hoodie.jpg' } });

    mutate
      .mockResolvedValueOnce({ data: { addToCart: [{ productId: 'p1', size: 'M', color: 'red', quantity: 2 }] } })
      .mockResolvedValueOnce({
        data: {
          addToCart: [
            { productId: 'p1', size: 'M', color: 'red', quantity: 2 },
            { productId: 'p2', size: 'L', color: 'blue', quantity: 1 },
          ],
        },
      });

    await mergeGuestCartOnLogin();

    expect(mutate).toHaveBeenCalledTimes(2);
    expect(query).not.toHaveBeenCalled(); // both snapshots already known from the guest cart
    expect(useStore.getState().cart).toEqual([
      { productId: 'p1', size: 'M', color: 'red', quantity: 2, product: { name: 'Tee', price: 20, effectivePrice: 20, image: 'tee.jpg' } },
      { productId: 'p2', size: 'L', color: 'blue', quantity: 1, product: { name: 'Hoodie', price: 50, effectivePrice: 50, image: 'hoodie.jpg' } },
    ]);
  });
});

describe('loadServerCart', () => {
  it('enriches raw server cart rows and sets the store', async () => {
    query.mockResolvedValue({ data: { product: { id: 'p1', name: 'Tee', price: 20, images: ['tee.jpg'] } } });

    await loadServerCart([{ productId: 'p1', size: 'M', color: 'red', quantity: 1 }]);

    expect(useStore.getState().cart).toEqual([
      { productId: 'p1', size: 'M', color: 'red', quantity: 1, product: { name: 'Tee', price: 20, effectivePrice: 20, image: 'tee.jpg' } },
    ]);
  });
});
