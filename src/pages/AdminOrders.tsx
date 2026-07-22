import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useProductCatalog } from '../hooks/useProductCatalog';
import { formatPrice } from '../utils/formatPrice';
import type { Order } from '../types/order';

const STATUS_OPTIONS: Order['status'][] = [
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'return_requested',
  'returned',
  'cancelled',
];

const STATUS_COLORS: Record<Order['status'], string> = {
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-yellow-50 text-yellow-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  return_requested: 'bg-orange-50 text-orange-600',
  returned: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-50 text-red-600',
};

export function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder, approveReturn, rejectReturn } = useOrders();
  const { increaseStock } = useProductCatalog();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');

  const handleStatusChange = (order: Order, newStatus: Order['status']) => {
    if (newStatus === 'cancelled' && order.status !== 'cancelled') {
      order.items.forEach((item) => {
        increaseStock(item.productId, item.size, item.quantity);
      });
    }
    updateOrderStatus(order.id, newStatus);
  };

  const handleApproveReturn = (order: Order) => {
    if (!confirm('Approve this return? Stock will be restored.')) return;
    order.items.forEach((item) => {
      increaseStock(item.productId, item.size, item.quantity);
    });
    approveReturn(order.id);
  };

  const handleRejectReturn = (order: Order) => {
    if (confirm('Reject this return request? Order will go back to "delivered".')) {
      rejectReturn(order.id);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Permanently delete this order? This cannot be undone.')) {
      deleteOrder(orderId);
      setExpandedId(null);
    }
  };

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  const totalRevenue = orders
  .filter((o) => !['cancelled', 'returned'].includes(o.status))
  .reduce((sum, o) => sum + o.total, 0);

  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin — Orders</h1>
          <p className="text-sm text-gray-400 mt-1">
            {orders.length} total orders · {formatPrice(totalRevenue)} revenue
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-400 text-sm">No orders match this filter.</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full flex flex-wrap items-center justify-between gap-3 p-4 text-left hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-900">{order.id}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.placedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {' · '}
                    {order.shippingAddress.fullName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatPrice(order.total)}</span>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </button>

              {expandedId === order.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3 text-sm">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-contain bg-white rounded-lg border border-gray-100"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-400">Size {item.size} · {item.color} · Qty {item.quantity}</p>
                        </div>
                        <span className="font-medium">
                          {formatPrice((item.discountPrice ?? item.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    <p className="font-medium text-gray-700 mb-1">Shipping to:</p>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.zip}</p>
                  </div>

                  {order.status === 'cancelled' ? (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">This order was cancelled — no further changes available.</p>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} /> Delete Order
                      </button>
                    </div>
                  ) : order.status === 'return_requested' ? (
                    <div>
                      <p className="text-sm text-gray-700 mb-1">
                        Customer requested a return
                        {order.returnReason && (
                          <span className="text-gray-500"> — reason: "{order.returnReason}"</span>
                        )}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleApproveReturn(order)}
                          className="text-sm bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800"
                        >
                          Approve Return
                        </button>
                        <button
                          onClick={() => handleRejectReturn(order)}
                          className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                        >
                          Reject Return
                        </button>
                      </div>
                    </div>
                  ) : order.status === 'returned' ? (
                    <p className="text-sm text-gray-400">This order has been returned. Stock was restored.</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Update status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order, e.target.value as Order['status'])}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm capitalize"
                      >
                        {STATUS_OPTIONS.filter(
                          (s) => s !== 'cancelled' && s !== 'return_requested' && s !== 'returned'
                        ).map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}