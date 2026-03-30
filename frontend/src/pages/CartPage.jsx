import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

function CartPage({ cart, updateQuantity, removeFromCart, updateGroupItemQuantity, removeGroupItem, user, activeGroup }) {
  const navigate = useNavigate();
  const groupMode = Boolean(activeGroup);
  const items = groupMode ? activeGroup.items || [] : cart;

  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [items]);
  const participantCount = activeGroup?.members?.length || activeGroup?.participantCount || 1;
  const splitPerPerson = participantCount ? total / participantCount : total;

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
          <div className="rounded-[32px] bg-white p-6 shadow-soft">
            <h1 className="font-display text-3xl font-bold text-slate-900">{groupMode ? 'Shared split cart' : 'Your cart'}</h1>
            <p className="mt-2 text-sm text-slate-500">
              {groupMode ? `Group ${activeGroup.groupCode} items are visible here for all joined users.` : 'Review quantities, then head to checkout and place your order.'}
            </p>
            <div className="mt-8 space-y-4">
              {items.length === 0 && <p className="text-sm text-slate-500">{groupMode ? 'No items added to the split order yet.' : 'Your cart is empty.'}</p>}
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-900">{item.menuName || item.name}</h2>
                    <p className="text-sm text-slate-500">{item.calories} kcal • Rs.{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => groupMode ? updateGroupItemQuantity(item.id, -1) : updateQuantity(item.id, -1)} className="h-10 w-10 rounded-full bg-slate-100 font-bold text-slate-700">-</button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button type="button" onClick={() => groupMode ? updateGroupItemQuantity(item.id, 1) : updateQuantity(item.id, 1)} className="h-10 w-10 rounded-full bg-slate-100 font-bold text-slate-700">+</button>
                    <button type="button" onClick={() => groupMode ? removeGroupItem(item.id) : removeFromCart(item.id)} className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-[32px] bg-slate-900 p-6 text-white shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Summary</p>
              {groupMode && (
                <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm text-slate-200">
                  <p>Group code: {activeGroup.groupCode}</p>
                  <p className="mt-1">Group ID: {activeGroup.id}</p>
                  <p className="mt-1">Restaurant ID: {activeGroup.restaurantId}</p>
                </div>
              )}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-slate-300">Items</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              {groupMode && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-slate-300">Participants</span>
                  <span className="font-semibold">{participantCount}</span>
                </div>
              )}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-slate-300">Total</span>
                <span className="font-display text-3xl font-bold text-brand-200">Rs.{total.toFixed(2)}</span>
              </div>
              {groupMode && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-slate-300">Equal split</span>
                  <span className="font-semibold">Rs.{splitPerPerson.toFixed(2)}</span>
                </div>
              )}
              <button type="button" disabled={!user || items.length === 0} onClick={() => navigate('/order')} className="mt-6 w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
                {groupMode ? 'Continue Split Checkout' : 'Proceed to Checkout'}
              </button>
            </div>
            {groupMode && (
              <div className="rounded-[32px] bg-white p-6 shadow-soft">
                <h2 className="font-display text-2xl font-bold text-slate-900">Group members</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {(activeGroup.members || []).map((member) => (
                    <div key={member.userId} className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p>User ID: {member.userId}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

