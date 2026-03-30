import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', password: '', otp: '' });
  const [otpHint, setOtpHint] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requestOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.requestLoginOtp({ email: form.email, password: form.password });
      setOtpHint(response.data.data?.otpHint || '');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.verifyLoginOtp({ email: form.email, otp: form.otp });
      onLogin(response.data.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] bg-white shadow-soft lg:grid-cols-[1.1fr,0.9fr]">
        <div className="relative hidden overflow-hidden bg-[#171f2f] p-10 text-white lg:block">
          <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
          <p className="relative text-sm uppercase tracking-[0.35em] text-brand-200">Swiggy style smart delivery</p>
          <h1 className="relative mt-6 font-display text-5xl font-bold leading-tight">Login with password plus OTP verification.</h1>
          <p className="relative mt-6 max-w-md text-slate-300">A polished food ordering experience with offers, recommendation intelligence, budget mode, and group checkout.</p>
          <div className="relative mt-10 grid gap-4">
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm text-slate-300">Live order tracking</p>
              <p className="mt-2 text-2xl font-bold">Placed to Delivered</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm text-slate-300">Smart recommendation</p>
              <p className="mt-2 text-2xl font-bold">Top 5 based on your history</p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">Account Access</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Use your password first, then confirm login with OTP.</p>
          </div>

          {step === 1 && (
            <form className="space-y-5" onSubmit={requestOtp}>
              <input type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500" required />
              <input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500" required />
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60">
                {loading ? 'Sending OTP...' : 'Continue with OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-5" onSubmit={verifyOtp}>
              <div className="rounded-3xl bg-brand-50 p-5">
                <p className="text-sm font-semibold text-brand-700">Demo OTP preview</p>
                <p className="mt-2 font-display text-3xl font-bold text-brand-600">{otpHint}</p>
                <p className="mt-2 text-xs text-slate-500">In a production app this would be delivered through SMS or email.</p>
              </div>
              <input type="text" placeholder="Enter OTP" value={form.otp} onChange={(event) => setForm({ ...form, otp: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500" required />
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60">
                {loading ? 'Verifying...' : 'Verify and Login'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-600">
                Edit credentials
              </button>
            </form>
          )}

          <p className="mt-6 text-sm text-slate-500">
            New user? <Link to="/register" className="font-semibold text-brand-600">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
