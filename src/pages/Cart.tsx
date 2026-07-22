import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/cart/CartItem';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../utils/formatPrice';

export function Cart() {
  const { items, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="mb-6">
        {items.map((item) => (
          <CartItem key={`${item.product.id}-${item.size}-${item.color}`} item={item} />
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-gray-200 pt-6">
        <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500">
          Clear Cart
        </button>

        <div className="text-right">
          <p className="text-sm text-gray-500 mb-2">
            Total: <span className="font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
          </p>
          <Link to="/checkout">
            <Button>Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
