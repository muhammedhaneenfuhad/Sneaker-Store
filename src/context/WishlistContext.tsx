import { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';

interface WishlistContextValue {
  productIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
  totalWishlisted: number;
}

type Action =
  | { type: 'TOGGLE'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; payload: string[] };

function wishlistReducer(state: string[], action: Action): string[] {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'TOGGLE':
      return state.includes(action.payload)
        ? state.filter((id) => id !== action.payload)
        : [...state, action.payload];
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

const STORAGE_KEY = 'sneaker-store-wishlist';

export const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, dispatch] = useReducer(wishlistReducer, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
  }, [productIds]);

  const toggleWishlist = (productId: string) => {
    dispatch({ type: 'TOGGLE', payload: productId });
  };

  const isWishlisted = (productId: string) => productIds.includes(productId);

  const clearWishlist = () => dispatch({ type: 'CLEAR' });

  return (
    <WishlistContext.Provider
      value={{ productIds, toggleWishlist, isWishlisted, clearWishlist, totalWishlisted: productIds.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}