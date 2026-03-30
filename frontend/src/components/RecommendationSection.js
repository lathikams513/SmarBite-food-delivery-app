import { useEffect, useState } from 'react';
import { smartApi } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

function RecommendationSection({ userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      return;
    }
    const loadRecommendations = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await smartApi.recommend(userId);
        setItems(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load recommendations yet.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [userId]);

  return (
    <section className="rounded-[28px] bg-slate-900 p-6 text-white shadow-soft">
      <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Smart Picks</p>
      <h2 className="mt-2 font-display text-2xl font-bold">Top recommendations for you</h2>
      {loading && <LoadingSpinner label="Building recommendations..." />}
      {!loading && error && <p className="mt-4 text-sm text-rose-200">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="mt-4 text-sm text-slate-300">Place a few orders and SmartBite will start suggesting your top items.</p>
      )}
      {!loading && items.length > 0 && (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="font-semibold">{item.name}</p>
              <p className="mt-1 text-sm text-slate-300">{item.category}</p>
              <p className="mt-3 font-bold text-brand-200">₹{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecommendationSection;
