import { useEffect, useState } from 'react';
import { smartApi } from '../services/api';
import LoadingSpinner from './LoadingSpinner.jsx';

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
    <section className="rounded-[32px] bg-[#171f2f] p-6 text-white shadow-soft">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Smart Picks</p>
        <h2 className="mt-2 font-display text-3xl font-bold">Based on your recent cravings</h2>
        {loading && <LoadingSpinner label="Building recommendations..." />}
        {!loading && error && <p className="mt-4 text-sm text-rose-200">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="mt-4 text-sm text-slate-200">Place a few orders and SmartBite will start suggesting your top items.</p>
        )}
        {!loading && items.length > 0 && (
          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-slate-200">{item.category} • {item.calories} kcal</p>
                <p className="mt-3 font-bold text-brand-200">Rs.{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RecommendationSection;
