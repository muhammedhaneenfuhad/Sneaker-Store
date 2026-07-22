import { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types/product';
import { initialProducts } from '../data/products';

interface ProductsContextValue {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  decreaseStock: (productId: string, size: string, quantity: number) => void;
  increaseStock: (productId: string, size: string, quantity: number) => void;
}
type Action =
  | { type: 'ADD'; payload: Product }
  | { type: 'UPDATE'; payload: { id: string; updates: Partial<Product> } }
  | { type: 'DELETE'; payload: string }
  | { type: 'DECREASE_STOCK'; payload: { productId: string; size: string; quantity: number } }
  | { type: 'INCREASE_STOCK'; payload: { productId: string; size: string; quantity: number } };

function productsReducer(state: Product[], action: Action): Product[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];

    case 'UPDATE':
      return state.map((product) =>
        product.id === action.payload.id ? { ...product, ...action.payload.updates } : product
      );

    case 'DELETE':
      return state.filter((product) => product.id !== action.payload);

    // BUY PRODUCT
    case 'DECREASE_STOCK':
      return state.map((product) => {
        if (product.id !== action.payload.productId) return product;

        const updatedSizes = product.sizes.map((size) => {
          if (size.value !== action.payload.size) return size;

          const newQuantity = size.quantity - action.payload.quantity;
          return { ...size, quantity: newQuantity, inStock: newQuantity > 0 };
        });

        return {
          ...product,
          sizes: updatedSizes,
          stock: updatedSizes.reduce((sum, s) => sum + s.quantity, 0),
        };
      });

    // CANCEL ORDER
    case 'INCREASE_STOCK':
      return state.map((product) => {
        if (product.id !== action.payload.productId) return product;

        const updatedSizes = product.sizes.map((size) => {
          if (size.value !== action.payload.size) return size;

          const newQuantity = size.quantity + action.payload.quantity;
          return { ...size, quantity: newQuantity, inStock: true };
        });

        return {
          ...product,
          sizes: updatedSizes,
          stock: updatedSizes.reduce((sum, s) => sum + s.quantity, 0),
        };
      });

    default:
      return state;
  }
}

const STORAGE_KEY = 'sneaker-store-products';

function loadInitialProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialProducts;
  } catch {
    return initialProducts;
  }
}

export const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, dispatch] = useReducer(productsReducer, [], loadInitialProducts);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    dispatch({ type: 'ADD', payload: { ...product, id: `P-${Date.now()}` } });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    dispatch({ type: 'UPDATE', payload: { id, updates } });
  };

  const deleteProduct = (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  const decreaseStock = (productId: string, size: string, quantity: number) => {
    dispatch({ type: 'DECREASE_STOCK', payload: { productId, size, quantity } });
  };

  const increaseStock = (productId: string, size: string, quantity: number) => {
    dispatch({ type: 'INCREASE_STOCK', payload: { productId, size, quantity } });
  };

  return (
    <ProductsContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, decreaseStock, increaseStock }}
    >
      {children}
    </ProductsContext.Provider>
  );
}