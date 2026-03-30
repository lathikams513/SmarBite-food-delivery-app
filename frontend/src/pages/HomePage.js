import { useEffect, useState } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import RecommendationSection from '../components/RecommendationSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { restaurantApi } from '../services/api';

function HomePage({ user }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-hero">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 rounded-[32px] bg-slate-900 p-8 text-white shadow-soft lg:grid-cols-[1.3fr,0.7fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-brand-200">Interview-ready full stack app</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Discover restaurants, optimize your budget, and order with friends.</h1>
            <p className="mt-4 max-w-2xl text-slate-300">SmartBite blends classic food delivery with recommendation intelligence, group checkout, calorie-aware menus, and live order updates.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm text-slate-300">Smart Recommendations</p>
              <p className="mt-2 font-display text-2xl font-bold">Top 5 favorite items</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm text-slate-300">Budget Mode</p>
              <p className="mt-2 font-display text-2xl font-bold">Build combos within your spend</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm text-slate-300">Group Ordering</p>
              <p className="mt-2 font-display text-2xl font-bold">Create, join, split, order</p>
            </div>
          </div>
        </section>

        {user && <div className="mt-8"><RecommendationSection userId={user.id} /></div>}

        <section className="mt-10">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Restaurants</p>
            <h2 className="font-display text-3xl font-bold text-slate-900">Fresh picks near you</h2>
          </div>
          {loading && <LoadingSpinner label="Fetching restaurants..." />}
          {!loading && error && <p className="text-sm text-rose-600">{error}</p>}
          {!loading && !error && (
            <div className="grid gap-6 lg:grid-cols-3">
              {restaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default HomePage;
