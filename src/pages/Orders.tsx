import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { useProductCatalog } from '../hooks/useProductCatalog';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../utils/formatPrice';

export function Orders() {
  const { orders, clearOrders, cancelOrder , requestReturn } = useOrders();
  const { increaseStock } = useProductCatalog();

  const handleCancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (confirm('Cancel this order?')) {
      order.items.forEach((item) => increaseStock(item.productId, item.size, item.quantity));
      cancelOrder(orderId);
    }
  };
  const handleRequestReturn = (orderId: string) => {
  const reason = prompt('Why are you returning this order? (e.g. wrong size, damaged, changed mind)');
  if (reason && reason.trim()) {
    requestReturn(orderId, reason.trim());
  }
};

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">No orders yet</h1>
        <p className="text-gray-500 mb-6">Your past orders will show up here once you check out.</p>
        <Link to="/shop"><Button>Browse Sneakers</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        {orders.some((o) => o.status === 'cancelled') && (
          <button
            onClick={() => confirm('Clear all cancelled orders? This cannot be undone.') && clearOrders()}
            className="text-sm text-gray-400 hover:text-red-500"
          >
            Clear Cancelled Orders
          </button>
        )}
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-100 rounded-2xl p-5">
            <div className="flex flex-wrap justify-between gap-3 mb-4 pb-4 border-b">
              <div>
                <p className="font-semibold text-gray-900">{order.id}</p>
                <p className="text-xs text-gray-400">
                  {new Date(order.placedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                {order.shippingAddress && (
                  <p className="text-xs text-gray-400 mt-1">
                    Shipping to: {order.shippingAddress.fullName}, {order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.zip}
                  </p>
                )}
              </div>
            <span
                className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                  order.status === 'cancelled'
                    ? 'bg-red-50 text-red-600'
                    : order.status === 'return_requested'
                    ? 'bg-orange-50 text-orange-600'
                    : order.status === 'returned'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-green-50 text-green-700'
                }`}
              >
                {order.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-contain bg-gray-50 rounded-lg" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.brand} · Size {item.size} · {item.color} · Qty {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice((item.discountPrice ?? item.price) * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-semibold mt-4 pt-4 border-t">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>

            {order.status === 'delivered' && (
              <button
                onClick={() => handleRequestReturn(order.id)}
                className="mt-3 text-sm text-orange-600 hover:text-orange-800"
              >
                Request Return
              </button>
            )}

            {order.status === 'return_requested' && (
              <p className="mt-3 text-sm text-gray-500">
                Return requested — waiting for approval.
                {order.returnReason && <span className="block text-xs text-gray-400 mt-1">Reason: {order.returnReason}</span>}
              </p>
            )}

            {order.status === 'returned' && (
              <p className="mt-3 text-sm text-gray-500">This order has been returned.</p>
            )}

            {!['delivered', 'return_requested', 'returned', 'cancelled'].includes(order.status) && (
              <button onClick={() => handleCancelOrder(order.id)} className="mt-3 text-sm text-red-500 hover:text-red-700">
                Cancel Order
              </button>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
}