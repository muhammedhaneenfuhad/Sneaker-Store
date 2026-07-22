import { useContext } from 'react';
import { ProductsContext } from '../context/ProductsContext';

export function useProductCatalog() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProductCatalog must be used within a ProductsProvider');
  return context;
}