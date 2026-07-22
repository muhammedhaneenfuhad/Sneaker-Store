import { Link } from 'react-router-dom';
import { Package, MapPin, Heart, ShoppingBag } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useAddresses } from '../hooks/useAddresses';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

export function Profile() {
  const { orders } = useOrders();
  const { addresses } = useAddresses();
  const { totalWishlisted } = useWishlist();
  const { totalItems } = useCart();

  const links = [
    {
      to: '/orders',
      icon: Package,
      label: 'My Orders',
      count: orders.length,
      description: 'Track and manage your orders',
    },
    {
      to: '/addresses',
      icon: MapPin,
      label: 'Saved Addresses',
      count: addresses.length,
      description: 'Manage your shipping addresses',
    },
    {
      to: '/wishlist',
      icon: Heart,
      label: 'Wishlist',
      count: totalWishlisted,
      description: 'Sneakers you\'ve saved',
    },
    {
      to: '/cart',
      icon: ShoppingBag,
      label: 'Cart',
      count: totalItems,
      description: 'Items ready for checkout',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-1">My Account</h1>
      <p className="text-gray-500 text-sm mb-8">Manage your orders, addresses, and saved items.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {links.map(({ to, icon: Icon, label, count, description }) => (
          <Link
            key={to}
            to={to}
            className="flex items-start gap-4 border border-gray-100 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="bg-gray-50 rounded-full p-3">
              <Icon size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">{label}</p>
                {count > 0 && (
                  <span className="text-xs bg-black text-white rounded-full px-2 py-0.5">
                    {count}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}