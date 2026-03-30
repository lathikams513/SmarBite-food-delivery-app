import { Link, NavLink, useNavigate } from 'react-router-dom';

function Navbar({ user, cartCount, onLogout }) {
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-800 hover:bg-slate-900/8 hover:text-slate-950'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-display text-2xl font-bold text-slate-950">SmartBite</Link>
          <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 shadow-sm lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">Delivery to</p>
            <p className="text-sm font-bold text-slate-900">{user?.address || 'Home • South India'}</p>
          </div>
        </div>
        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/cart" className={navClass}>Cart ({cartCount})</NavLink>
          <NavLink to="/orders" className={navClass}>Orders</NavLink>
          <NavLink to="/group-order" className={navClass}>Split Order</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-950">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <p className="text-xs font-semibold text-brand-500">User ID: {user.id}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  navigate('/login');
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
