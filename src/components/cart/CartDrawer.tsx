import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CartItem } from './CartItem';
import { Button } from '../ui/Button';
import { formatPrice } from '../../utils/formatPrice';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalPrice } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-xl
          transform transition-transform duration-300 flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-lg">Your Cart ({items.length})</h2>
          <button onClick={onClose} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 mt-20">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <CartItem key={`${item.product.id}-${item.size}-${item.color}`} item={item} />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100">
            <div className="flex justify-between font-semibold mb-4">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <Link to="/checkout" onClick={onClose}>
              <Button className="w-full">Checkout</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}