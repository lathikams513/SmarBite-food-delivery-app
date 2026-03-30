import { useEffect, useMemo, useState } from 'react';
import RestaurantCard from '../components/RestaurantCard.jsx';
import RecommendationSection from '../components/RecommendationSection.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { restaurantApi } from '../services/api';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=70';

const sectionBackgrounds = {
  cuisine: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=70'
};

function HomePage({ user }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('All');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantApi.list();
        setRestaurants(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch restaurants');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const cuisineFilters = useMemo(() => {
    const cuisines = restaurants.map((restaurant) => restaurant.cuisine.split(',')[0].trim());
    return ['All', ...new Set(cuisines)];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesQuery = !query || `${restaurant.name} ${restaurant.cuisine} ${restaurant.tags} ${restaurant.location}`.toLowerCase().includes(query.toLowerCase());
      const matchesCuisine = activeCuisine === 'All' || restaurant.cuisine.toLowerCase().includes(activeCuisine.toLowerCase());
      return matchesQuery && matchesCuisine;
    });
  }, [restaurants, query, activeCuisine]);

  return (
    <div className="min-h-screen bg-transparent">
      <section className="relative min-h-[84vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto flex min-h-[84vh] max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="text-sm uppercase tracking-[0.38em] text-brand-200">SmartBite</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight sm:text-6xl">Fast food delivery with a smoother, lighter SmartBite experience.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">Heavy video and GIF sections are removed now, so the app loads faster and feels smoother to use.</p>
            <div className="mt-8 max-w-2xl rounded-[28px] border border-white/18 bg-white/12 p-3 shadow-2xl">
              <div className="flex items-center gap-3 rounded-[22px] bg-white/10 px-4 py-4 text-white">
                <span className="text-lg">⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search biryani, pizza, burgers, bowls..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/60"
                />
              </div>
              <button className="mt-3 rounded-[22px] border border-white/18 bg-white/14 px-5 py-3 font-semibold text-white transition hover:bg-white/22 sm:px-8">
                Start Ordering
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {['OTP Login', 'Split Order', 'Budget Mode', 'Live Tracking'].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {user && (
          <section className="mb-8">
            <RecommendationSection userId={user.id} />
          </section>
        )}

        <section className="mb-10 overflow-hidden rounded-[34px]">
          <div
            className="relative overflow-hidden rounded-[34px] px-6 py-8 text-white shadow-[0_22px_50px_rgba(15,23,42,0.18)] sm:px-8"
            style={{
              backgroundImage: `linear-gradient(120deg, rgba(15,23,42,0.78), rgba(15,23,42,0.35)), url(${sectionBackgrounds.cuisine})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Browse by cuisine</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {cuisineFilters.map((cuisine) => (
                <button
                  type="button"
                  key={cuisine}
                  onClick={() => setActiveCuisine(cuisine)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeCuisine === cuisine ? 'bg-white text-slate-950 shadow-lg' : 'bg-white/16 text-white hover:bg-white/24'}`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8 grid items-center gap-6 lg:grid-cols-[1fr_260px]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-brand-500">Restaurant Feed</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-950">Choose a restaurant and order in seconds</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{filteredRestaurants.length} restaurants available. Fast browse pannalam, direct-a menu ku pogalam.</p>
          </div>
          <div className="justify-self-start rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="rounded-[20px] bg-[#fff5e8] px-5 py-6 text-center">
              <p className="text-4xl">🍕 🍔 🍜</p>
              <p className="mt-3 text-sm font-semibold text-slate-700">Quick browse</p>
              <p className="mt-1 text-xs text-slate-500">Less animation, faster loading</p>
            </div>
          </div>
        </section>

        <section className="mt-6">
          {loading && <LoadingSpinner label="Fetching restaurants..." />}
          {!loading && error && <p className="text-sm text-rose-600">{error}</p>}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredRestaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default HomePage;
