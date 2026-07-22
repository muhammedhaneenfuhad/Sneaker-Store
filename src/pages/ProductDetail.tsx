import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getRelatedProducts } from '../data/products';
import { ProductGallery } from '../components/product/ProductGallery';
import { SizeSelector } from '../components/product/SizeSelector';
import { ColorSelector } from '../components/product/ColorSelector';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { Price } from '../components/ui/Price';
import { Button } from '../components/ui/Button';
import { useCart } from '../hooks/useCart';
import { useProductCatalog } from '../hooks/useProductCatalog';

export function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { products } = useProductCatalog();
  const { items, addItem } = useCart();

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  const relatedProducts = getRelatedProducts(product, products);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? '');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor(product.colors[0]?.name ?? '');
    setActiveImageIndex(0);
    window.scrollTo(0, 0);
  }, [slug, product.id]);

  // Is the currently selected size/color already in the cart?
  const isInCart = selectedSize
    ? items.some(
        (i) => i.product.id === product.id && i.size === selectedSize && i.color === selectedColor
      )
    : false;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addItem(product, selectedSize, selectedColor, product.images[activeImageIndex]);
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addItem(product, selectedSize, selectedColor, product.images[activeImageIndex]);
    navigate('/checkout');
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-10">
        <ProductGallery
          images={product.images}
          name={product.name}
          activeIndex={activeImageIndex}
          onActiveIndexChange={setActiveImageIndex}
        />

        <div>
          <p className="text-sm text-gray-400 uppercase">{product.brand}</p>
          <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          <Price price={product.price} discountPrice={product.discountPrice} className="mt-3 text-lg" />
          <p className="text-gray-600 mt-4">{product.description}</p>

          <div className="mt-6">
            <ColorSelector colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} />
          </div>

          <div className="mt-6">
            <SizeSelector sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {isInCart ? (
              <Button onClick={handleGoToCart} className="w-full sm:w-1/2">
                Go to Cart
              </Button>
            ) : (
              <Button onClick={handleAddToCart} className="w-full sm:w-1/2">
                Add to Cart
              </Button>
            )}

            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="w-full sm:w-1/2 color-white border-white hover:bg-white hover:text-black"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}