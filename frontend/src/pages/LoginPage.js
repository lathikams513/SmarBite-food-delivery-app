import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.login(form);
      onLogin(response.data.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4 py-10">
      <div className="grid max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-soft lg:grid-cols-[1.1fr,0.9fr]">
        <div className="hidden bg-slate-900 p-10 text-white lg:block">
          <p className="text-sm uppercase tracking-[0.4em] text-brand-200">SmartBite Delivery</p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight">Food delivery with smarter choices and faster checkout.</h1>
          <p className="mt-6 max-w-md text-slate-300">Recommendations, budget-friendly combinations, group ordering, and live tracking in one polished dashboard.</p>
        </div>
        <div className="p-8 sm:p-10">
          <h2 className="font-display text-3xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue ordering from your favorite restaurants.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <input type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500" required />
            <input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500" required />
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60">
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-500">
            New user? <Link to="/register" className="font-semibold text-brand-600">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
