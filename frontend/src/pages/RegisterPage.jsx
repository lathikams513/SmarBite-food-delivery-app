import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', otp: '' });
  const [otpHint, setOtpHint] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const requestOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await authApi.requestRegisterOtp({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address
      });
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
      await authApi.verifyRegisterOtp({ email: form.email, otp: form.otp });
      setSuccess('Account verified successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] bg-white shadow-soft lg:grid-cols-[0.95fr,1.05fr]">
        <div className="bg-brand-500 p-10 text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-white/75">Create account</p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight">Build your SmartBite profile with OTP verification.</h1>
          <p className="mt-6 max-w-md text-white/85">Get a Swiggy-inspired ordering experience plus group ordering, nutrition info, budget combos, and personalized recommendations.</p>
          <div className="mt-8 grid gap-3">
            {['OTP verified sign up', 'Restaurant discovery cards', 'Live delivery stages', 'Budget and recommendation engine'].map((item) => (
              <div key={item} className="rounded-2xl bg-white/15 px-4 py-3 font-semibold backdrop-blur">{item}</div>
            ))}
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <h2 className="font-display text-3xl font-bold text-slate-900">Start ordering smarter</h2>
          <p className="mt-2 text-sm text-slate-500">Complete your details and verify your OTP to activate the account.</p>

          {step === 1 && (
            <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={requestOtp}>
              <input className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none sm:col-span-2" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none sm:col-span-2" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <textarea className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none sm:col-span-2" rows="4" placeholder="Delivery address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              {error && <p className="text-sm text-rose-600 sm:col-span-2">{error}</p>}
              <button type="submit" disabled={loading} className="rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60 sm:col-span-2">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="mt-8 space-y-5" onSubmit={verifyOtp}>
              <div className="rounded-3xl bg-brand-50 p-5">
                <p className="text-sm font-semibold text-brand-700">Demo OTP preview</p>
                <p className="mt-2 font-display text-3xl font-bold text-brand-600">{otpHint}</p>
                <p className="mt-2 text-xs text-slate-500">Use this OTP to complete signup in the demo environment.</p>
              </div>
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" placeholder="Enter OTP" value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} required />
              {error && <p className="text-sm text-rose-600">{error}</p>}
              {success && <p className="text-sm text-emerald-600">{success}</p>}
              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-600">
                Edit details
              </button>
            </form>
          )}

          <p className="mt-6 text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-brand-600">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
