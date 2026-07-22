import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const navigate = useNavigate();

  if (products.length === 0) {
    return <p className="text-center text-gray-400 py-20">No sneakers match your filters.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={(p) => navigate(`/product/${p.slug}`)}
        />
      ))}
    </div>
  );
}