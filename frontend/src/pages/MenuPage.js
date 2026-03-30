import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import MenuItemCard from '../components/MenuItemCard';
import { restaurantApi, smartApi } from '../services/api';

function MenuPage({ onAddToCart }) {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [budget, setBudget] = useState('');
  const [budgetSuggestion, setBudgetSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const response = await restaurantApi.menu(restaurantId);
        setMenuItems(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to fetch menu');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  const groupedMenu = useMemo(() => menuItems.reduce((acc, item) => {
    acc[item.category] = [...(acc[item.category] || []), item];
    return acc;
  }, {}), [menuItems]);

  const handleBudgetMode = async (event) => {
    event.preventDefault();
    try {
      const response = await smartApi.budget({ restaurantId: Number(restaurantId), budget: Number(budget) });
      setBudgetSuggestion(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to build budget combination');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1fr,330px]">
          <div>
            <div className="mb-8 rounded-[30px] bg-white p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Menu & nutrition</p>
              <h1 className="mt-2 font-display text-4xl font-bold text-slate-900">Pick your meal</h1>
              <p className="mt-3 max-w-2xl text-slate-500">Every item shows calories, price, and category so the app feels useful beyond a simple checkout screen.</p>
            </div>
            {loading && <LoadingSpinner label="Loading menu..." />}
            {!loading && error && <p className="text-sm text-rose-600">{error}</p>}
            {!loading && !error && Object.entries(groupedMenu).map(([category, items]) => (
              <section key={category} className="mb-8">
                <h2 className="mb-4 font-display text-2xl font-bold text-slate-900">{category}</h2>
                <div className="grid gap-4">
                  {items.map((item) => <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />)}
                </div>
              </section>
            ))}
          </div>
          <aside className="space-y-6">
            <div className="rounded-[28px] bg-slate-900 p-6 text-white shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Budget Mode</p>
              <h2 className="mt-3 font-display text-2xl font-bold">Find the best mix within your spend</h2>
              <form className="mt-5 space-y-4" onSubmit={handleBudgetMode}>
                <input type="number" min="1" placeholder="Enter budget in INR" value={budget} onChange={(event) => setBudget(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-brand-300 focus:outline-none" required />
                <button type="submit" className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600">Suggest Combo</button>
              </form>
              {budgetSuggestion && (
                <div className="mt-6 rounded-2xl bg-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Selected total</span>
                    <span className="font-bold text-brand-200">₹{budgetSuggestion.total}</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {budgetSuggestion.items.map((item) => (
                      <div key={item.id} className="rounded-xl bg-white/10 p-3">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-slate-300">₹{item.price} • {item.calories} kcal</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default MenuPage;
