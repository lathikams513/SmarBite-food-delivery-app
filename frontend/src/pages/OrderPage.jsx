import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api';

const paymentMethods = [
  { id: 'COD', title: 'Cash on Delivery', subtitle: 'Pay after food reaches you' },
  { id: 'UPI', title: 'UPI Payment', subtitle: 'PhonePe, GPay, Paytm or BHIM' },
  { id: 'CARD', title: 'Credit or Debit Card', subtitle: 'Secure online card payment' }
];

function OrderPage({ user, cart, clearCart, activeGroup, completeGroupOrder }) {
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const items = activeGroup ? activeGroup.items || [] : cart;
  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [items]);
  const members = activeGroup?.members || [];

  const splitRows = useMemo(() => {
    if (!activeGroup) return [];
    const count = members.length || activeGroup.participantCount || 1;
    return members.map((member) => ({
      ...member,
      amount: activeGroup.customSplits?.[member.userId] !== undefined && activeGroup.customSplits?.[member.userId] !== ''
        ? Number(activeGroup.customSplits[member.userId])
        : Number((total / count).toFixed(2))
    }));
  }, [activeGroup, members, total]);

  const handlePlaceOrder = async () => {
    if (!user || items.length === 0) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        userId: user.id,
        restaurantId: activeGroup ? activeGroup.restaurantId : items[0].restaurantId,
        deliveryAddress,
        groupOrderId: activeGroup?.id || null,
        items: items.map((item) => ({ menuId: item.id, quantity: item.quantity }))
      };
      const response = await orderApi.place(payload);
      if (activeGroup) {
        completeGroupOrder(response.data.data.id);
      } else {
        clearCart();
      }
      setMessage(`Order #${response.data.data.id} placed successfully with ${paymentMethod}.`);
      setTimeout(() => navigate('/orders'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-6 shadow-soft">
            <h1 className="font-display text-3xl font-bold text-slate-900">Checkout and Payment</h1>
            <p className="mt-2 text-sm text-slate-500">Confirm your address, choose a payment method, and place the order.</p>
            {activeGroup && (
              <div className="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Split order active</p>
                <p className="mt-1">Group Code: {activeGroup.groupCode}</p>
                <p className="mt-1">Group ID: {activeGroup.id}</p>
              </div>
            )}
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-soft">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Delivery address</label>
            <textarea rows="5" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" />
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-500">Choose payment</p>
            <div className="mt-5 space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full rounded-[24px] border px-5 py-4 text-left transition ${paymentMethod === method.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-200'}`}
                >
                  <p className="font-semibold text-slate-900">{method.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{method.subtitle}</p>
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">Real online payment gateway integration needs merchant keys. UI selection is ready here.</p>
          </div>

          <div className="rounded-[32px] bg-[#171f2f] p-6 text-white shadow-soft">
            <h2 className="font-display text-2xl font-bold">Order summary</h2>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.menuName || item.name} x {item.quantity}</span>
                  <span>Rs.{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            {activeGroup && (
              <div className="mt-6 rounded-3xl bg-white/10 p-5 text-sm text-slate-200">
                <p className="font-semibold text-white">Custom split summary</p>
                <div className="mt-3 space-y-2">
                  {splitRows.map((row) => (
                    <div key={row.userId} className="flex items-center justify-between">
                      <span>{row.name} (ID: {row.userId})</span>
                      <span>Rs.{Number(row.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 rounded-3xl bg-white/10 p-5 text-sm text-slate-200">
              <p>Selected payment: {paymentMethod}</p>
              <p className="mt-2">Live status stages: Placed to Preparing to Out for Delivery to Delivered</p>
            </div>
            {message && <p className="mt-4 text-sm text-emerald-300">{message}</p>}
            {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Total payable</span>
                <span className="font-display text-3xl font-bold text-brand-200">Rs.{total.toFixed(2)}</span>
              </div>
              <button type="button" onClick={handlePlaceOrder} disabled={loading || items.length === 0} className="mt-6 w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60">
                {loading ? 'Processing order...' : 'Pay and Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;


