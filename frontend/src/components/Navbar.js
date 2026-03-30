import { Link, NavLink, useNavigate } from 'react-router-dom';

function Navbar({ user, cartCount, onLogout }) {
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-2xl font-bold text-slate-900">SmartBite</Link>
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navClass}>Restaurants</NavLink>
          <NavLink to="/cart" className={navClass}>Cart ({cartCount})</NavLink>
          <NavLink to="/orders" className={navClass}>Orders</NavLink>
          <NavLink to="/group-order" className={navClass}>Group Order</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  navigate('/login');
                }}
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
