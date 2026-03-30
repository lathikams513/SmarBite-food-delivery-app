import { Link } from 'react-router-dom';

function RestaurantCard({ restaurant }) {
  return (
    <div className="group overflow-hidden rounded-[28px] bg-white shadow-soft transition duration-300 hover:-translate-y-1">
      <div className="h-48 bg-cover bg-center transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${restaurant.imageUrl})` }} />
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-slate-900">{restaurant.name}</h3>
            <p className="text-sm text-slate-500">{restaurant.cuisine} • {restaurant.location}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">{restaurant.rating} ★</span>
        </div>
        <p className="text-sm leading-6 text-slate-600">{restaurant.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500">{restaurant.etaMinutes} mins delivery</span>
          <Link to={`/menu/${restaurant.id}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500">
            Explore Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
