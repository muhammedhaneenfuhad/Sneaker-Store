import { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, selectedImage: string, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

type Action =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string; color: string } }
  | { type: 'UPDATE_QTY'; payload: { productId: string; size: string; color: string; quantity: number } }
  | { type: 'CLEAR' };

function getSizeStock(product: Product, size: string) {
  const sizeData = product.sizes.find((s) => s.value === size);
  return sizeData?.quantity ?? 0;
}

function cartReducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(
        (i) =>
          i.product.id === action.payload.product.id &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );

      const maxStock = getSizeStock(action.payload.product, action.payload.size);

      if (existing) {
        const newQuantity = existing.quantity + action.payload.quantity;

        if (newQuantity > maxStock) {
          console.warn(
            `Cannot add "${action.payload.product.name}" size ${action.payload.size}: requested ${newQuantity}, only ${maxStock} in stock.`
          );
          return state;
        }

        return state.map((i) => (i === existing ? { ...i, quantity: newQuantity } : i));
      }

      if (action.payload.quantity > maxStock) {
        console.warn(
          `Cannot add "${action.payload.product.name}" size ${action.payload.size}: only ${maxStock} in stock.`
        );
        return state;
      }

      return [...state, action.payload];
    }

    case 'REMOVE_ITEM':
      return state.filter(
        (i) =>
          !(
            i.product.id === action.payload.productId &&
            i.size === action.payload.size &&
            i.color === action.payload.color
          )
      );

    case 'UPDATE_QTY': {
      if (action.payload.quantity <= 0) {
        return state.filter(
          (i) =>
            !(
              i.product.id === action.payload.productId &&
              i.size === action.payload.size &&
              i.color === action.payload.color
            )
        );
      }

      return state.map((i) => {
        if (
          i.product.id === action.payload.productId &&
          i.size === action.payload.size &&
          i.color === action.payload.color
        ) {
          const maxStock = getSizeStock(i.product, i.size);
          if (action.payload.quantity > maxStock) return i;
          return { ...i, quantity: action.payload.quantity };
        }
        return i;
      });
    }

    case 'CLEAR':
      return [];

    default:
      return state;
  }
}

const STORAGE_KEY = 'sneaker-store-cart';

function loadInitialCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadInitialCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, size: string, color: string, selectedImage: string, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, size, color, selectedImage, quantity } });
  };

  const removeItem = (productId: string, size: string, color: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, size, color } });
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QTY', payload: { productId, size, color, quantity } });
  };

  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}