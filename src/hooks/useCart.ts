import { useCallback } from 'react';
import client from '../services/apollo/client';
import useStore from '../services/store/useStore';
import {
  ADD_TO_CART_MUTATION,
  UPDATE_CART_ITEM_MUTATION,
  REMOVE_FROM_CART_MUTATION,
} from '../services/graphql/queries/cart';
import { GET_PRODUCT_QUERY } from '../services/graphql/queries/products';
import type {
  AddToCartResponse,
  UpdateCartItemResponse,
  RemoveFromCartResponse,
  RawCartItem,
} from '../services/graphql/models/cart';
import type { ProductResponse } from '../services/graphql/models/product';
import type { Product } from '../services/models/product';
import type { CartItem } from '../services/models/cart';

const toSnapshot = (product: Product): CartItem['product'] => ({
  name: product.name,
  price: product.price,
  effectivePrice: product.effectivePrice ?? product.price,
  image: product.images[0] ?? '',
});

// Denormalizes raw cart rows into CartItems; `cache` seeds known product
// snapshots so only unseen products get fetched.
export const enrichCart = async (
  rawItems: RawCartItem[],
  cache: Map<string, CartItem['product']>,
): Promise<CartItem[]> => {
  const missingIds = [
    ...new Set(rawItems.map((item) => item.productId)),
  ].filter((id) => !cache.has(id));

  await Promise.all(
    missingIds.map(async (id) => {
      const result = await client.query<ProductResponse>({
        query: GET_PRODUCT_QUERY,
        variables: { id },
      });
      if (result.data?.product) {
        cache.set(id, toSnapshot(result.data.product));
      }
    }),
  );

  return rawItems.map((item) => ({
    ...item,
    product: cache.get(item.productId) ?? { name: '', price: 0, effectivePrice: 0, image: '' },
  }));
};

const currentSnapshotCache = () => {
  const cache = new Map<string, CartItem['product']>();
  useStore
    .getState()
    .cart.forEach((item) => cache.set(item.productId, item.product));
  return cache;
};

// Replays guest cart as addToCart calls after login (no guest-cart concept
// server-side); sequential to avoid races on the same User document.
export const mergeGuestCartOnLogin = async (): Promise<void> => {
  const guestCart = useStore.getState().cart;
  if (guestCart.length === 0) return;

  const cache = currentSnapshotCache();
  let lastRaw: RawCartItem[] | undefined;

  for (const item of guestCart) {
    const result = await client.mutate<AddToCartResponse>({
      mutation: ADD_TO_CART_MUTATION,
      variables: {
        productId: item.productId,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      },
    });
    if (result.data?.addToCart) lastRaw = result.data.addToCart;
  }

  if (lastRaw) {
    useStore.getState().setCart(await enrichCart(lastRaw, cache));
  }
};

// Loads server-side cart on session restore, no guest merge needed.
export const loadServerCart = async (rawCart: RawCartItem[]): Promise<void> => {
  useStore
    .getState()
    .setCart(await enrichCart(rawCart, currentSnapshotCache()));
};

export const useCart = () => {
  const cart = useStore((state) => state.cart);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const storeAddItem = useStore((state) => state.addItem);
  const storeRemoveItem = useStore((state) => state.removeItem);
  const storeUpdateQuantity = useStore((state) => state.updateQuantity);
  const storeClearCart = useStore((state) => state.clearCart);
  const setCart = useStore((state) => state.setCart);
  const setNotification = useStore((state) => state.setNotification);

  const addItem = useCallback(
    async (product: Product, size: string, color: string, quantity = 1) => {
      const snapshot = toSnapshot(product);
      if (!isAuthenticated) {
        storeAddItem(
          { productId: product.id, size, color, product: snapshot },
          quantity,
        );
        return;
      }
      try {
        const result = await client.mutate<AddToCartResponse>({
          mutation: ADD_TO_CART_MUTATION,
          variables: { productId: product.id, size, color, quantity },
        });
        if (result.data?.addToCart) {
          const cache = currentSnapshotCache();
          cache.set(product.id, snapshot);
          setCart(await enrichCart(result.data.addToCart, cache));
        }
      } catch (err) {
        console.error('Add to cart failed:', err);
        setNotification({
          message: 'Could not add item to cart',
          severity: 'error',
        });
        throw err;
      }
    },
    [isAuthenticated, storeAddItem, setCart, setNotification],
  );

  const removeItem = useCallback(
    async (productId: string, size: string, color: string) => {
      if (!isAuthenticated) {
        storeRemoveItem(productId, size, color);
        return;
      }
      try {
        const result = await client.mutate<RemoveFromCartResponse>({
          mutation: REMOVE_FROM_CART_MUTATION,
          variables: { productId, size, color },
        });
        if (result.data?.removeFromCart) {
          setCart(
            await enrichCart(
              result.data.removeFromCart,
              currentSnapshotCache(),
            ),
          );
        }
      } catch (err) {
        console.error('Remove from cart failed:', err);
        setNotification({
          message: 'Could not remove item from cart',
          severity: 'error',
        });
        throw err;
      }
    },
    [isAuthenticated, storeRemoveItem, setCart, setNotification],
  );

  const updateQuantity = useCallback(
    async (
      productId: string,
      size: string,
      color: string,
      quantity: number,
    ) => {
      if (!isAuthenticated) {
        storeUpdateQuantity(productId, size, color, quantity);
        return;
      }
      try {
        const result = await client.mutate<UpdateCartItemResponse>({
          mutation: UPDATE_CART_ITEM_MUTATION,
          variables: { productId, size, color, quantity },
        });
        if (result.data?.updateCartItem) {
          setCart(
            await enrichCart(
              result.data.updateCartItem,
              currentSnapshotCache(),
            ),
          );
        }
      } catch (err) {
        console.error('Update cart item failed:', err);
        setNotification({
          message: 'Could not update item quantity',
          severity: 'error',
        });
        throw err;
      }
    },
    [isAuthenticated, storeUpdateQuantity, setCart, setNotification],
  );

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart: storeClearCart,
  };
};
