import { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Address } from '../types/address';

interface AddressContextValue {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, updates: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

type Action =
  | { type: 'ADD'; payload: Address }
  | { type: 'UPDATE'; payload: { id: string; updates: Omit<Address, 'id'> } }
  | { type: 'DELETE'; payload: string }
  | { type: 'SET_DEFAULT'; payload: string };

function addressReducer(state: Address[], action: Action): Address[] {
  switch (action.type) {
    case 'ADD': {
      // If this is the first address, or marked default, unset others
      const shouldBeDefault = state.length === 0 || action.payload.isDefault;
      const next = shouldBeDefault
        ? state.map((a) => ({ ...a, isDefault: false }))
        : state;
      return [...next, { ...action.payload, isDefault: shouldBeDefault }];
    }

    case 'UPDATE': {
      const willBeDefault = action.payload.updates.isDefault;
      return state.map((a) => {
        if (a.id === action.payload.id) {
          return { ...a, ...action.payload.updates };
        }
        return willBeDefault ? { ...a, isDefault: false } : a;
      });
    }

    case 'DELETE':
      return state.filter((a) => a.id !== action.payload);

    case 'SET_DEFAULT':
      return state.map((a) => ({ ...a, isDefault: a.id === action.payload }));

    default:
      return state;
  }
}

const STORAGE_KEY = 'sneaker-store-addresses';

function loadInitialAddresses(): Address[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export const AddressContext = createContext<AddressContextValue | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, dispatch] = useReducer(addressReducer, [], loadInitialAddresses);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (address: Omit<Address, 'id'>) => {
    dispatch({ type: 'ADD', payload: { ...address, id: `ADDR-${Date.now()}` } });
  };

  const updateAddress = (id: string, updates: Omit<Address, 'id'>) => {
    dispatch({ type: 'UPDATE', payload: { id, updates } });
  };

  const deleteAddress = (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  const setDefaultAddress = (id: string) => {
    dispatch({ type: 'SET_DEFAULT', payload: id });
  };

  return (
    <AddressContext.Provider
      value={{ addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
}