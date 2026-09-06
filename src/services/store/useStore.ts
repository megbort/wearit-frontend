import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/services/models/product';
import type { CartItem } from '@/services/models/cart';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Notification {
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

interface StoreState {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => void;
  clearCart: () => void;

  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;

  notification: Notification | null;
  setNotification: (notification: Notification) => void;
  clearNotification: () => void;

  products: Product[];
  setProducts: (products: Product[]) => void;
}

// Matches the backend's addToCart identity rule
const sameLine = (
  a: { productId: string; size: string; color: string },
  b: typeof a,
) => a.productId === b.productId && a.size === b.size && a.color === b.color;

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      setCart: (cart) => set({ cart }),
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.cart.some((line) => sameLine(line, item));
          if (existing) {
            return {
              cart: state.cart.map((line) =>
                sameLine(line, item)
                  ? { ...line, quantity: line.quantity + quantity }
                  : line,
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity }] };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          cart: state.cart.filter(
            (line) => !sameLine(line, { productId, size, color }),
          ),
        })),
      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          cart: state.cart.map((line) =>
            sameLine(line, { productId, size, color })
              ? { ...line, quantity }
              : line,
          ),
        })),
      clearCart: () => set({ cart: [] }),

      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, cart: [] }),
      setLoading: (loading) => set({ isLoading: loading }),

      notification: null,
      setNotification: (notification) => set({ notification }),
      clearNotification: () => set({ notification: null }),

      products: [],
      setProducts: (products) => set({ products }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
      }),
    },
  ),
);

export default useStore;
