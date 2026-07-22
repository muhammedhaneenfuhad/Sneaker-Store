export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: 'running' | 'basketball' | 'lifestyle' | 'skateboarding' | 'training' | 'football';
  description: string;
  price: number;
  discountPrice?: number;
  currency: string;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  gender: 'men' | 'women' | 'unisex' | 'kids';
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  stock: number;
  tags?: string[];
  createdAt: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  images?: string[];
}

export interface ProductSize {
  value: string;
  inStock: boolean;
  quantity: number;
}