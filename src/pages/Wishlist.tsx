import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { useProductCatalog } from '../hooks/useProductCatalog';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';

export function Wishlist() {
  const { productIds } = useWishlist();
  const { products } = useProductCatalog();
  const wishlistedProducts = products.filter((p) => productIds.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-6">Tap the heart icon on any sneaker to save it here.</p>
        <Link to="/shop">
          <Button>Browse Sneakers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist ({wishlistedProducts.length})</h1>
      <ProductGrid products={wishlistedProducts} />
    </div>
  );
}