import type { Product } from './product';

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
  selectedImage: string;
}

export interface CartState {
  items: CartItem[];
}