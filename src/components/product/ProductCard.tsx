import { Heart } from 'lucide-react';
import type { Product } from '../../types/product';
import { Rating } from '../ui/Rating';
import { Price } from '../ui/Price';
import { useWishlist } from '../../hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { name, brand, images, price, discountPrice, rating, reviewCount, isNew, colors } = product;
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div
      onClick={() => onClick?.(product)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100
                 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      {isNew && (
        <span className="absolute top-3 left-3 z-10 bg-black text-white text-xs
                          font-semibold px-2 py-1 rounded-full">
          New
        </span>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute top-3 right-3 z-10 bg-white/90 rounded-full p-1.5 hover:scale-110 transition-transform"
      >
        <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
      </button>

      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-contain p-6 group-hover:scale-105
                     transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{brand}</p>
        <h3 className="font-medium text-gray-900 truncate">{name}</h3>

        <div className="flex items-center gap-1 mt-1">
          <Rating value={rating} />
          <span className="text-xs text-gray-400">({reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex gap-1">
            {colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                className="w-3 h-3 rounded-full border border-gray-200"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <Price price={price} discountPrice={discountPrice} className="mt-2" />
      </div>
    </div>
  );
}