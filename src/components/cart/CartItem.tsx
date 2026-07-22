import { Trash2, Minus, Plus } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types/cart';
import { useCart } from '../../hooks/useCart';
import { Price } from '../ui/Price';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart();

  const { product, size, color, quantity } = item;


  // Get selected size stock
  const sizeStock =
    product.sizes.find(
      (s) => s.value === size
    )?.quantity ?? 0;



  const handleDecrease = () => {
    updateQuantity(
      product.id,
      size,
      color,
      Math.max(1, quantity - 1)
    );
  };



  const handleIncrease = () => {

    if (quantity < sizeStock) {
      updateQuantity(
        product.id,
        size,
        color,
        quantity + 1
      );
    }

  };



  return (
    <div className="flex gap-4 py-4 border-b border-gray-100">

      {/* Product Image */}
      <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={item.selectedImage}
          alt={product.name}
          className="w-full h-full object-contain p-2"
        />
      </div>



      <div className="flex-1">

        <div className="flex justify-between">

          <div>

            <p className="text-xs text-gray-400 uppercase">
              {product.brand}
            </p>


            <h4 className="font-medium text-gray-900">
              {product.name}
            </h4>


            <p className="text-sm text-gray-500 mt-1">
              Size {size} · {color}
            </p>

          </div>



          <button
            onClick={() =>
              removeItem(
                product.id,
                size,
                color
              )
            }
            className="text-gray-300 hover:text-red-500 transition-colors h-fit"
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>

        </div>




        <div className="flex items-center justify-between mt-3">


          {/* Quantity Controller */}
          <div>

            <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-1">

              <button
                onClick={handleDecrease}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>



              <span className="text-sm w-4 text-center">
                {quantity}
              </span>



              <button
                onClick={handleIncrease}
                disabled={quantity >= sizeStock}
                aria-label="Increase quantity"
                className={
                  quantity >= sizeStock
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:text-black"
                }
              >
                <Plus size={14} />
              </button>


            </div>



            {quantity >= sizeStock && (
              <p className="text-xs text-red-500 mt-2">
                Maximum stock reached ({sizeStock})
              </p>
            )}

          </div>





          {/* Price */}
          <Price
            price={product.price * quantity}
            discountPrice={
              product.discountPrice
                ? product.discountPrice * quantity
                : undefined
            }
          />


        </div>


      </div>


    </div>
  );
}