import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import MenuItemCard from '../components/MenuItemCard.jsx';
import { restaurantApi, smartApi } from '../services/api';

function MenuPage({ onAddToCart, activeGroup }) {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [budget, setBudget] = useState('');
  const [menuQuery, setMenuQuery] = useState('');
  const [budgetSuggestion, setBudgetSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [menuResponse, restaurantsResponse] = await Promise.all([
          restaurantApi.menu(restaurantId),
          restaurantApi.list()
        ]);
        const restaurantList = restaurantsResponse.data.data || [];
        setRestaurant(restaurantList.find((item) => String(item.id) === String(restaurantId)) || null);
        setMenuItems(menuResponse.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to fetch menu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [restaurantId]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => !menuQuery || `${item.name} ${item.category} ${item.itemTag}`.toLowerCase().includes(menuQuery.toLowerCase()));
  }, [menuItems, menuQuery]);

  const groupedMenu = useMemo(() => filteredItems.reduce((acc, item) => {
    acc[item.category] = [...(acc[item.category] || []), item];
    return acc;
  }, {}), [filteredItems]);

  const handleBudgetMode = async (event) => {
    event.preventDefault();
    try {
      const response = await smartApi.budget({ restaurantId: Number(restaurantId), budget: Number(budget) });
      setBudgetSuggestion(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to build budget combination');
    }
  };

  const isSplitRestaurant = activeGroup && String(activeGroup.restaurantId) === String(restaurantId);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {restaurant && (
          <section className="relative overflow-hidden rounded-[36px] bg-[#171f2f] p-8 text-white shadow-soft">
            <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${restaurant.heroImageUrl || restaurant.imageUrl})` }} />
            <div className="relative grid gap-6 lg:grid-cols-[1fr,320px]">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-200">{restaurant.discountText || restaurant.offerText}</p>
                <h1 className="mt-3 font-display text-4xl font-bold">{restaurant.name}</h1>
                <p className="mt-2 text-slate-300">{restaurant.cuisine} • {restaurant.location}</p>
                <p className="mt-4 max-w-2xl text-slate-300">{restaurant.description}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">Restaurant ID: {restaurant.id}</span>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">{restaurant.rating} ★ rating</span>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">{restaurant.etaMinutes} mins</span>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">Rs.{restaurant.priceForTwo} for two</span>
                </div>
                {activeGroup && (
                  <div className={`mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${isSplitRestaurant ? 'bg-emerald-500/20 text-emerald-100' : 'bg-amber-400/20 text-amber-100'}`}>
                    {isSplitRestaurant ? `Split order active: ${activeGroup.groupCode}` : `Split order ${activeGroup.groupCode} belongs to restaurant ID ${activeGroup.restaurantId}`}
                  </div>
                )}
              </div>
              <div className="rounded-[28px] bg-white p-5 text-slate-900">
                <p className="text-sm uppercase tracking-[0.25em] text-brand-500">Find your dish</p>
                <input value={menuQuery} onChange={(event) => setMenuQuery(event.target.value)} placeholder="Search in menu..." className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" />
                <div className="mt-5 rounded-2xl bg-brand-50 p-4">
                  <p className="text-sm font-semibold text-brand-700">Offer running</p>
                  <p className="mt-2 font-display text-2xl font-bold text-brand-600">{restaurant.offerText}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr,340px]">
          <div>
            {loading && <LoadingSpinner label="Loading menu..." />}
            {!loading && error && <p className="text-sm text-rose-600">{error}</p>}
            {!loading && !error && Object.entries(groupedMenu).map(([category, items]) => (
              <section key={category} className="mb-8">
                <h2 className="mb-4 font-display text-2xl font-bold text-slate-900">{category}</h2>
                <div className="grid gap-4">
                  {items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={onAddToCart}
                      addLabel={isSplitRestaurant ? 'Add to Split' : 'Add to Cart'}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] bg-white p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Budget Mode</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-slate-900">Build a combo within your spend</h2>
              <form className="mt-5 space-y-4" onSubmit={handleBudgetMode}>
                <input type="number" min="1" placeholder="Enter budget in INR" value={budget} onChange={(event) => setBudget(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none" required />
                <button type="submit" className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600">Suggest Combo</button>
              </form>
              {budgetSuggestion && (
                <div className="mt-6 rounded-2xl bg-brand-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Selected total</span>
                    <span className="font-bold text-brand-700">Rs.{budgetSuggestion.total}</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {budgetSuggestion.items.map((item) => (
                      <div key={item.id} className="rounded-xl bg-white p-3">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-slate-500">Rs.{item.price} • {item.calories} kcal</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[28px] bg-[#171f2f] p-6 text-white shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Split order help</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>Create or join split order first.</p>
                <p>Open same restaurant menu using the restaurant ID.</p>
                <p>Then added dishes go into the shared split cart.</p>
                <p>Checkout page la split summary visible-a varum.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default MenuPage;
