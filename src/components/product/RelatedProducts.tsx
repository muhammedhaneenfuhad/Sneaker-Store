import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const navigate = useNavigate();

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
      <h2 className="text-xl font-bold mb-6">You might also like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={(p) => navigate(`/product/${p.slug}`)}
          />
        ))}
      </div>
    </section>
  );
}