import { useSearchParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useProductCatalog } from '../hooks/useProductCatalog';
import { ProductGrid } from '../components/product/ProductGrid';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const { products } = useProductCatalog();

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return products.filter((product) => {
      const haystack = [
        product.name,
        product.brand,
        product.category,
        product.description,
        ...(product.tags ?? []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [query, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-2">
        Search results for "<span className="text-gray-600">{query}</span>"
      </h1>
      <p className="text-sm text-gray-400 mb-6">{results.length} results</p>

      {results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No sneakers matched your search.</p>
          <Link to="/shop" className="text-sm underline text-gray-700 hover:text-black">
            Browse all sneakers instead
          </Link>
        </div>
      ) : (
        <ProductGrid products={results} />
      )}
    </div>
  );
}