import { CategoryType } from './category';

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  images: string[];
  colors: string[];
  sizes: string[];
  details: string[];
  featured?: boolean;
  sale?: boolean;
  discountPercent?: number;
  effectivePrice?: number;
  category?: CategoryType;
}
