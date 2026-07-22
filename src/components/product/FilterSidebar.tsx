import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { Product } from '../../types/product';

interface Filters {
  category?: Product['category'];
  gender?: Product['gender'];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  search?: string;
}

interface FilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  availableBrands: string[];
  resultCount: number;
}

const MAX_PRICE = 5000;

export function FilterSidebar({ filters, setFilters, availableBrands, resultCount }: FilterSidebarProps) {
  const [priceValue, setPriceValue] = useState(filters.maxPrice ?? MAX_PRICE);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount =
    (filters.brands?.length ?? 0) +
    (filters.gender ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice != null && filters.maxPrice < MAX_PRICE ? 1 : 0);

  const toggleBrand = (brand: string) => {
    setFilters((prev) => {
      const current = prev.brands ?? [];
      const next = current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand];
      return { ...prev, brands: next };
    });
  };

  const handlePriceChange = (value: number) => {
    setPriceValue(value);
    setFilters((prev) => ({ ...prev, maxPrice: value }));
  };

  const handleGenderChange = (gender: Product['gender'] | undefined) => {
    setFilters((prev) => ({ ...prev, gender }));
  };

  const clearAll = () => {
    setFilters((prev) => ({ category: prev.category }));
    setPriceValue(MAX_PRICE);
  };

  const filterContent = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button onClick={clearAll} className="text-xs text-gray-400 hover:text-black">
          Clear all
        </button>
      </div>

      {/* Price range */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Max Price</p>
        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          step={10}
          value={priceValue}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-black"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>₹0</span>
          <span>₹{priceValue}</span>
        </div>
      </div>

      {/* Gender */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Gender</p>
        <div className="space-y-2">
          {(['men', 'women', 'unisex', 'kids'] as const).map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer capitalize">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === g}
                onChange={() => handleGenderChange(g)}
                className="accent-black"
              />
              {g}
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="radio"
              name="gender"
              checked={!filters.gender}
              onChange={() => handleGenderChange(undefined)}
              className="accent-black"
            />
            All
          </label>
        </div>
      </div>

      {/* Brands */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Brand</p>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {availableBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brands?.includes(brand) ?? false}
                onChange={() => toggleBrand(brand)}
                className="accent-black"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* In stock only */}
      <div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly ?? false}
            onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
            className="accent-black"
          />
          In stock only
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger bar */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-sm font-medium border border-gray-200 rounded-lg px-4 py-2"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeCount > 0 && (
            <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
        <p className="text-sm text-gray-400">{resultCount} results</p>
      </div>

      {/* Desktop sidebar — always visible */}
      <aside className="hidden md:block w-64 shrink-0">{filterContent}</aside>

      {/* Mobile drawer */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`md:hidden fixed inset-0 bg-black/40 z-50 transition-opacity
          ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl
          max-h-[85vh] overflow-y-auto p-6 transform transition-transform duration-300
          ${mobileOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
            <X size={22} />
          </button>
        </div>

        {filterContent}

        <button
          onClick={() => setMobileOpen(false)}
          className="w-full mt-8 bg-black text-white py-3 rounded-xl font-medium"
        >
          Show {resultCount} results
        </button>
      </div>
    </>
  );
}