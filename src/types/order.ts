import type { Address } from './address';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  discountPrice?: number;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  placedAt: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'return_requested' | 'returned' | 'cancelled';
  shippingAddress: Address;
  returnReason?: string;
}