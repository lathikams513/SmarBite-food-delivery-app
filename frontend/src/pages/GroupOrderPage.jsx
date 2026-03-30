import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { smartApi } from '../services/api';

function GroupOrderPage({ user, activeGroup, onActivateGroup, onUpdateGroupSplit }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('create');
  const [createForm, setCreateForm] = useState({ createdBy: user?.id || '', restaurantId: '' });
  const [joinForm, setJoinForm] = useState({ groupCode: '', userId: user?.id || '' });
  const [createdGroup, setCreatedGroup] = useState(null);
  const [joinedGroup, setJoinedGroup] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setCreateForm((current) => ({ ...current, createdBy: user?.id || '' }));
    setJoinForm((current) => ({ ...current, userId: user?.id || '' }));
  }, [user]);

  const currentGroup = useMemo(() => activeGroup, [activeGroup]);
  const total = (currentGroup?.items || []).reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const members = currentGroup?.members || [];

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await smartApi.createGroup({ createdBy: Number(createForm.createdBy), restaurantId: Number(createForm.restaurantId) });
      setCreatedGroup(response.data.data);
      await onActivateGroup(response.data.data.groupCode);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create split order');
    }
  };

  const handleJoin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await smartApi.joinGroup({ groupCode: joinForm.groupCode, userId: Number(joinForm.userId) });
      setJoinedGroup(response.data.data);
      await onActivateGroup(response.data.data.groupCode);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join split order');
    }
  };

  const getSuggestedSplit = (memberId) => {
    const customValue = currentGroup?.members?.find((member) => Number(member.userId) === Number(memberId))?.customAmount;
    if (customValue !== undefined && customValue !== null && customValue !== '') {
      return customValue;
    }
    const count = members.length || currentGroup?.participantCount || 1;
    return count ? (total / count).toFixed(2) : total.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[34px] bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Split Order</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-slate-900">Order together and split the amount easily</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">Create or join a code, open the same restaurant menu, add shared items, then place one group order.</p>

          <div className="mt-6 rounded-[24px] border border-brand-100 bg-brand-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Your Details</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{user?.name || 'Logged in user'}</p>
            <p className="mt-1 text-sm text-slate-600">User ID: <span className="font-bold text-slate-900">{user?.id}</span></p>
            <p className="mt-1 text-sm text-slate-600">Use this same user ID while creating or joining a split order.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setStep('create')} className={`rounded-full px-5 py-3 text-sm font-semibold ${step === 'create' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Create Split Order</button>
            <button type="button" onClick={() => setStep('join')} className={`rounded-full px-5 py-3 text-sm font-semibold ${step === 'join' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Join with Code</button>
          </div>

          {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

          {step === 'create' && (
            <form onSubmit={handleCreate} className="mt-8 space-y-4 rounded-[28px] bg-[#fff8f2] p-6">
              <div>
                <p className="text-sm font-semibold text-slate-900">Step 1</p>
                <p className="text-sm text-slate-500">Enter your user ID and restaurant ID to create a shareable split order.</p>
              </div>
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" placeholder="Your user ID" value={createForm.createdBy} onChange={(e) => setCreateForm({ ...createForm, createdBy: e.target.value })} required />
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" placeholder="Restaurant ID" value={createForm.restaurantId} onChange={(e) => setCreateForm({ ...createForm, restaurantId: e.target.value })} required />
              <button type="submit" className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600">Generate Split Code</button>

              {createdGroup && (
                <div className="rounded-[24px] bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Share this code with friends</p>
                  <p className="mt-2 font-display text-4xl font-bold text-brand-600">{createdGroup.groupCode}</p>
                  <div className="mt-4 space-y-1 text-sm text-slate-600">
                    <p>Group ID: {createdGroup.id}</p>
                    <p>Restaurant ID: {createdGroup.restaurantId}</p>
                    <p>Participants: {currentGroup?.members?.length || createdGroup.participantCount}</p>
                  </div>
                  <button type="button" onClick={() => navigate(`/menu/${createdGroup.restaurantId}`)} className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-brand-500">
                    Open Restaurant Menu
                  </button>
                </div>
              )}
            </form>
          )}

          {step === 'join' && (
            <form onSubmit={handleJoin} className="mt-8 space-y-4 rounded-[28px] bg-[#171f2f] p-6 text-white">
              <div>
                <p className="text-sm font-semibold text-brand-200">Step 2</p>
                <p className="text-sm text-slate-300">Paste the split code and your user ID to join the order.</p>
              </div>
              <input className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-brand-300 focus:outline-none" placeholder="Split code" value={joinForm.groupCode} onChange={(e) => setJoinForm({ ...joinForm, groupCode: e.target.value.toUpperCase() })} required />
              <input className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-brand-300 focus:outline-none" placeholder="Your user ID" value={joinForm.userId} onChange={(e) => setJoinForm({ ...joinForm, userId: e.target.value })} required />
              <button type="submit" className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600">Join Split Order</button>

              {joinedGroup && (
                <div className="rounded-[24px] bg-white/10 p-5">
                  <p className="text-sm text-slate-300">You joined successfully</p>
                  <p className="mt-2 font-display text-3xl font-bold">{joinedGroup.groupCode}</p>
                  <div className="mt-4 space-y-1 text-sm text-slate-300">
                    <p>Group ID: {joinedGroup.id}</p>
                    <p>Restaurant ID: {joinedGroup.restaurantId}</p>
                    <p>Participants: {currentGroup?.members?.length || joinedGroup.participantCount}</p>
                  </div>
                  <button type="button" onClick={() => navigate(`/menu/${joinedGroup.restaurantId}`)} className="mt-4 rounded-2xl bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-brand-50">
                    Open Shared Restaurant
                  </button>
                </div>
              )}
            </form>
          )}

          {currentGroup && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-brand-500">Shared split cart</p>
                    <h2 className="mt-2 font-display text-2xl font-bold text-slate-900">Group {currentGroup.groupCode}</h2>
                  </div>
                  <button type="button" onClick={() => navigate(`/menu/${currentGroup.restaurantId}`)} className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">
                    Add Items
                  </button>
                </div>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p>Group ID: {currentGroup.id}</p>
                  <p className="mt-1">Restaurant ID: {currentGroup.restaurantId}</p>
                  <p className="mt-1">Status: {currentGroup.status}</p>
                </div>
                <div className="mt-5 space-y-3">
                  {(currentGroup.items || []).length === 0 && <p className="text-sm text-slate-500">No shared items yet. Open the restaurant and start adding dishes.</p>}
                  {(currentGroup.items || []).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{item.menuName}</p>
                          <p className="text-sm text-slate-500">Qty {item.quantity} • Rs.{item.price}</p>
                        </div>
                        <p className="font-semibold text-slate-900">Rs.{(Number(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] bg-[#171f2f] p-6 text-white shadow-sm">
                <p className="text-sm uppercase tracking-[0.25em] text-brand-200">Custom split</p>
                <h2 className="mt-2 font-display text-2xl font-bold">Set each person share</h2>
                <div className="mt-5 space-y-4">
                  {members.map((member) => (
                    <div key={member.userId} className="rounded-2xl bg-white/10 p-4">
                      <p className="font-semibold">{member.name}</p>
                      <p className="mt-1 text-sm text-slate-300">User ID: {member.userId}</p>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={getSuggestedSplit(member.userId)}
                        onChange={(event) => onUpdateGroupSplit(member.userId, event.target.value)}
                        className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-brand-300 focus:outline-none"
                        placeholder="Enter share amount"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-slate-200">
                  <p>Total shared amount: Rs.{total.toFixed(2)}</p>
                  <p className="mt-1">Members: {members.length || currentGroup.participantCount}</p>
                </div>
                <button type="button" onClick={() => navigate('/cart')} className="mt-5 w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600">
                  Go to Shared Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupOrderPage;
