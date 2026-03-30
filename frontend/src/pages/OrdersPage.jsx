import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import OrderTracker from '../components/OrderTracker.jsx';
import { orderApi } from '../services/api';

function OrdersPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const response = await orderApi.history(user.id);
        setOrders(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to fetch order history');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Order history</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-slate-900">Track every delivery stage</h1>
        </div>
        {loading && <LoadingSpinner label="Fetching orders..." />}
        {!loading && error && <p className="text-sm text-rose-600">{error}</p>}
        {!loading && !error && orders.length === 0 && <p className="text-sm text-slate-500">No orders yet.</p>}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-[30px] bg-white p-6 shadow-soft">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Order #{order.id}</p>
                  <p className="mt-2 text-sm text-slate-500">{order.deliveryAddress}</p>
                  <p className="mt-1 text-sm text-slate-500">Restaurant ID: {order.restaurantId}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl font-bold text-slate-900">₹{order.totalAmount}</p>
                  <p className="text-sm text-slate-500">{order.status}</p>
                </div>
              </div>
              <div className="mt-6"><OrderTracker status={order.status} /></div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{item.menuName}</p>
                    <p className="text-sm text-slate-500">Qty {item.quantity} • {item.calories} kcal</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
