import { useMemo, useState } from 'react';
import type { Product } from '../types/product';
import { useProductCatalog } from './useProductCatalog';

interface Filters {
  category?: Product['category'];
  gender?: Product['gender'];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  search?: string;
}

export function useProducts() {
  const { products } = useProductCatalog();
  const [filters, setFilters] = useState<Filters>({});

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const effectivePrice = p.discountPrice ?? p.price;
      if (filters.category && p.category !== filters.category) return false;
      if (filters.gender && p.gender !== filters.gender) return false;
      if (filters.brands && filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (filters.minPrice != null && effectivePrice < filters.minPrice) return false;
      if (filters.maxPrice != null && effectivePrice > filters.maxPrice) return false;
      if (filters.inStockOnly && p.stock <= 0) return false;
      if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [products, filters]);

  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, [products]);

  return { products: filtered, filters, setFilters, availableBrands };
}