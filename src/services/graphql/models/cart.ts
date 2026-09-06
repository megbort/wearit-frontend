export interface RawCartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

export interface AddToCartResponse {
  addToCart: RawCartItem[];
}

export interface UpdateCartItemResponse {
  updateCartItem: RawCartItem[];
}

export interface RemoveFromCartResponse {
  removeFromCart: RawCartItem[];
}

export interface ClearCartResponse {
  clearCart: boolean;
}
