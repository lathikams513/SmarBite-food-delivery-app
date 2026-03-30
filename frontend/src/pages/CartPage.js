import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CartPage({ cart, updateQuantity, removeFromCart, user, setGroupOrderId }) {
  const navigate = useNavigate();
  const [groupCode, setGroupCode] = useState('');

  const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [cart]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
          <div className="rounded-[32px] bg-white p-6 shadow-soft">
            <h1 className="font-display text-3xl font-bold text-slate-900">Your cart</h1>
            <p className="mt-2 text-sm text-slate-500">Review quantities, then head to checkout and place your order.</p>
            <div className="mt-8 space-y-4">
              {cart.length === 0 && <p className="text-sm text-slate-500">Your cart is empty.</p>}
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-900">{item.name}</h2>
                    <p className="text-sm text-slate-500">{item.calories} kcal • ₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => updateQuantity(item.id, -1)} className="h-10 w-10 rounded-full bg-slate-100 font-bold text-slate-700">-</button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, 1)} className="h-10 w-10 rounded-full bg-slate-100 font-bold text-slate-700">+</button>
                    <button type="button" onClick={() => removeFromCart(item.id)} className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-[32px] bg-slate-900 p-6 text-white shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Summary</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-slate-300">Items</span>
                <span className="font-semibold">{cart.length}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-slate-300">Total</span>
                <span className="font-display text-3xl font-bold text-brand-200">₹{total.toFixed(2)}</span>
              </div>
              <button type="button" disabled={!user || cart.length === 0} onClick={() => navigate('/order')} className="mt-6 w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
                Proceed to Checkout
              </button>
            </div>
            <div className="rounded-[32px] bg-white p-6 shadow-soft">
              <h2 className="font-display text-2xl font-bold text-slate-900">Attach a group order</h2>
              <p className="mt-2 text-sm text-slate-500">If you already joined a group, save the group code or numeric group ID here before placing the order.</p>
              <input value={groupCode} onChange={(event) => setGroupCode(event.target.value)} placeholder="Group order ID" className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" />
              <button type="button" onClick={() => setGroupOrderId(groupCode)} className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-brand-500">
                Save Group ID
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
