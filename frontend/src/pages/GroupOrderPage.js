import { useState } from 'react';
import { smartApi } from '../services/api';

function GroupOrderPage({ user }) {
  const [createForm, setCreateForm] = useState({ createdBy: user?.id || '', restaurantId: '' });
  const [joinForm, setJoinForm] = useState({ groupCode: '', userId: user?.id || '' });
  const [createdGroup, setCreatedGroup] = useState(null);
  const [joinedGroup, setJoinedGroup] = useState(null);
  const [error, setError] = useState('');

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await smartApi.createGroup({ createdBy: Number(createForm.createdBy), restaurantId: Number(createForm.restaurantId) });
      setCreatedGroup(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group order');
    }
  };

  const handleJoin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await smartApi.joinGroup({ groupCode: joinForm.groupCode, userId: Number(joinForm.userId) });
      setJoinedGroup(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group order');
    }
  };

  return (
    <div className="min-h-screen bg-hero">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Group ordering</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-slate-900">Create shared orders and split the bill automatically</h1>
        </div>
        {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={handleCreate} className="rounded-[32px] bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-bold text-slate-900">Create a group</h2>
            <p className="mt-2 text-sm text-slate-500">Start a shared order with a restaurant and invite friends using the generated code.</p>
            <div className="mt-6 space-y-4">
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" placeholder="Creator user ID" value={createForm.createdBy} onChange={(e) => setCreateForm({ ...createForm, createdBy: e.target.value })} required />
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" placeholder="Restaurant ID" value={createForm.restaurantId} onChange={(e) => setCreateForm({ ...createForm, restaurantId: e.target.value })} required />
              <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-brand-500">Create Group Order</button>
            </div>
            {createdGroup && (
              <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">Group code: {createdGroup.groupCode}</p>
                <p className="mt-2 text-sm text-slate-500">Participants: {createdGroup.participantCount}</p>
                <p className="text-sm text-slate-500">Split amount: ₹{createdGroup.splitAmount}</p>
              </div>
            )}
          </form>
          <form onSubmit={handleJoin} className="rounded-[32px] bg-slate-900 p-6 text-white shadow-soft">
            <h2 className="font-display text-2xl font-bold">Join a group</h2>
            <p className="mt-2 text-sm text-slate-300">Enter the shared group code and your user ID to become part of the order.</p>
            <div className="mt-6 space-y-4">
              <input className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-brand-300 focus:outline-none" placeholder="Group code" value={joinForm.groupCode} onChange={(e) => setJoinForm({ ...joinForm, groupCode: e.target.value })} required />
              <input className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-brand-300 focus:outline-none" placeholder="User ID" value={joinForm.userId} onChange={(e) => setJoinForm({ ...joinForm, userId: e.target.value })} required />
              <button type="submit" className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600">Join Group Order</button>
            </div>
            {joinedGroup && (
              <div className="mt-6 rounded-3xl bg-white/10 p-5">
                <p className="font-semibold">Joined group: {joinedGroup.groupCode}</p>
                <p className="mt-2 text-sm text-slate-300">Participants: {joinedGroup.participantCount}</p>
                <p className="text-sm text-slate-300">Current split per user: ₹{joinedGroup.splitAmount}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default GroupOrderPage;
