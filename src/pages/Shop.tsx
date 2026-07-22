import { useParams } from 'react-router-dom'; 
import { useEffect } from 'react';
import { ProductGrid } from '../components/product/ProductGrid';
import { FilterSidebar } from '../components/product/FilterSidebar';
import { useProducts } from '../hooks/useProducts';

export function Shop() {
  const { category } = useParams();
  const { products, filters, setFilters, availableBrands } = useProducts();

  useEffect(() => {
    setFilters((prev) => ({ ...prev, category: category as any }));
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6 capitalize">{category ?? 'All Sneakers'}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          availableBrands={availableBrands}
          resultCount={products.length}
        />

        <div className="flex-1">
          <p className="hidden md:block text-sm text-gray-400 mb-4">{products.length} results</p>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}