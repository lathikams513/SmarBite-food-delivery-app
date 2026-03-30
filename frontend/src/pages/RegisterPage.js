import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await authApi.register(form);
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-soft sm:p-10">
        <h1 className="font-display text-3xl font-bold text-slate-900">Create your SmartBite account</h1>
        <p className="mt-2 text-sm text-slate-500">Set up your profile once and unlock recommendations and live order tracking.</p>
        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <input className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none sm:col-span-2" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none sm:col-span-2" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <textarea className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none sm:col-span-2" rows="4" placeholder="Delivery address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          {error && <p className="text-sm text-rose-600 sm:col-span-2">{error}</p>}
          {success && <p className="text-sm text-emerald-600 sm:col-span-2">{success}</p>}
          <button type="submit" disabled={loading} className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60 sm:col-span-2">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-brand-600">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
