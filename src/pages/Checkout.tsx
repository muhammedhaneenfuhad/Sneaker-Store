import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { useAddresses } from '../hooks/useAddresses';
import { useProductCatalog } from '../hooks/useProductCatalog';
import { AddressForm } from '../components/checkout/AddressForm';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../utils/formatPrice';
import type { CartItem } from '../types/cart';

export function Checkout() {
  const { items, totalPrice, clearCart, updateQuantity } = useCart();
  const { placeOrder } = useOrders();
  const { addresses, addAddress } = useAddresses();
  const { decreaseStock } = useProductCatalog();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null
  );
  const [addingNew, setAddingNew] = useState(addresses.length === 0);

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses.find((a) => a.isDefault)?.id ?? addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // Check stock before payment
  const checkStock = () => {
    for (const item of items) {
      const available = item.product.sizes.find((s) => s.value === item.size)?.quantity ?? 0;
      if (item.quantity > available) {
        alert(`${item.product.name} Size ${item.size} only ${available} available`);
        return false;
      }
    }
    return true;
  };

  // Increase quantity
  const handleIncrease = (item: CartItem) => {
    const sizeStock = item.product.sizes.find((s) => s.value === item.size)?.quantity ?? 0;
    if (item.quantity >= sizeStock) {
      return;
    }
    updateQuantity(item.product.id, item.size, item.color, item.quantity + 1);
  };

  // Decrease quantity
  const handleDecrease = (item: CartItem) => {
    if (item.quantity <= 1) {
      return;
    }
    updateQuantity(item.product.id, item.size, item.color, item.quantity - 1);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (submitting) return;
    if (!checkStock()) return;

    const shippingAddress = addresses.find((a) => a.id === selectedAddressId);

    if (!shippingAddress) {
      alert('Please select or add shipping address');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      items.forEach((item) => {
        decreaseStock(item.product.id, item.size, item.quantity);
      });

      placeOrder(items, totalPrice, shippingAddress);
      clearCart();
      setSubmitting(false);
      navigate('/orders');
      alert('Order placed successfully!');
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500">Your cart is empty. Add items before checkout.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-5 gap-12">
      <form onSubmit={handleSubmit} className="space-y-4 md:col-span-3">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <div className="flex justify-between">
          <p className="font-medium">Shipping Address</p>
          <Link to="/addresses" className="text-xs text-gray-400">
            Manage addresses
          </Link>
        </div>

        {addresses.length > 0 && !addingNew && (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={`flex gap-3 border rounded-xl p-3 cursor-pointer ${
                  selectedAddressId === addr.id ? 'border-black' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                />
                <span>
                  <b>{addr.label}</b>
                  <span className="block text-sm text-gray-500">{addr.fullName}</span>
                  <span className="block text-sm text-gray-500">
                    {addr.street}, {addr.city} {addr.zip}
                  </span>
                </span>
              </label>
            ))}

            <button type="button" onClick={() => setAddingNew(true)} className="text-sm underline">
              + New Address
            </button>
          </div>
        )}

        {(addingNew || addresses.length === 0) && (
          <AddressForm
            onSave={(data) => {
              addAddress(data);
              setAddingNew(false);
            }}
            onCancel={() => setAddingNew(false)}
          />
        )}

        <div>
          <label>Card Number</label>
          <input
            required
            type="text"
            placeholder="4242 4242 4242 4242"
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Processing...' : `Pay ${formatPrice(totalPrice)}`}
        </Button>
      </form>

      <div className="md:col-span-2">
        <h2 className="font-semibold mb-4">Order Summary</h2>

        <div className="space-y-3">
          {items.map((item) => {
            const sizeStock = item.product.sizes.find((s) => s.value === item.size)?.quantity ?? 0;
            const atMaxStock = item.quantity >= sizeStock;

            return (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="border-b border-gray-100 pb-3"
              >
                <p className="font-medium">{item.product.name}</p>
                <p className="text-xs text-gray-400">
                  Size {item.size} · {item.color}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 border rounded-lg px-2 py-1">
                    <button type="button" onClick={() => handleDecrease(item)}>
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleIncrease(item)}
                      disabled={atMaxStock}
                      className="disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="font-medium">
                    {formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity)}
                  </span>
                </div>

                {atMaxStock && (
                  <p className="text-xs text-red-500 mt-2">
                    Maximum stock reached ({sizeStock})
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between font-semibold mt-4 pt-4 border-t">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}