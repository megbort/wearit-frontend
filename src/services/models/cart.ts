export interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    effectivePrice: number;
    image: string;
  };
}
