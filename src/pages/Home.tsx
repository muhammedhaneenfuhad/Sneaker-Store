import { Link } from 'react-router-dom';
import { ProductGrid } from '../components/product/ProductGrid';
import { useProductCatalog } from '../hooks/useProductCatalog';

export function Home() {
  const { products } = useProductCatalog();
  const featured = products.filter((p) => p.isFeatured);

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Step Into Something New
        </h1>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Discover the latest sneaker drops from your favorite brands.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-8 bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Shop Now
        </Link> 
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold mb-6">Featured</h2>
        <ProductGrid products={featured} />
      </section>
    </div>
  );
}