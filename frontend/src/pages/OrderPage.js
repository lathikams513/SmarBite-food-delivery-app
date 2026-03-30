import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api';

function OrderPage({ user, cart, clearCart, groupOrderId }) {
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [cart]);

  const handlePlaceOrder = async () => {
    if (!user || cart.length === 0) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        userId: user.id,
        restaurantId: cart[0].restaurantId,
        deliveryAddress,
        groupOrderId: groupOrderId && !Number.isNaN(Number(groupOrderId)) ? Number(groupOrderId) : null,
        items: cart.map((item) => ({ menuId: item.id, quantity: item.quantity }))
      };
      const response = await orderApi.place(payload);
      clearCart();
      setMessage(`Order #${response.data.data.id} placed successfully.`);
      setTimeout(() => navigate('/orders'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
          <div className="rounded-[32px] bg-white p-6 shadow-soft">
            <h1 className="font-display text-3xl font-bold text-slate-900">Checkout</h1>
            <p className="mt-2 text-sm text-slate-500">Confirm your delivery details and send the order to the kitchen.</p>
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Delivery address</label>
              <textarea rows="5" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" />
            </div>
            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Live status stages</p>
              <p className="mt-3 text-sm text-slate-600">Placed → Preparing → Out for Delivery → Delivered</p>
            </div>
            {message && <p className="mt-4 text-sm text-emerald-600">{message}</p>}
            {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
          </div>
          <div className="rounded-[32px] bg-slate-900 p-6 text-white shadow-soft">
            <h2 className="font-display text-2xl font-bold">Order summary</h2>
            <div className="mt-6 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Total payable</span>
                <span className="font-display text-3xl font-bold text-brand-200">₹{total.toFixed(2)}</span>
              </div>
              <button type="button" onClick={handlePlaceOrder} disabled={loading || cart.length === 0} className="mt-6 w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60">
                {loading ? 'Placing order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
