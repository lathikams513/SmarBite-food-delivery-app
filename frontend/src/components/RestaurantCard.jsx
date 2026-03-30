import { Link } from 'react-router-dom';

function RestaurantCard({ restaurant }) {
  const tags = restaurant.tags?.split(',').slice(0, 3) || [];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(252,128,25,0.12)]">
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition duration-500 hover:scale-105" style={{ backgroundImage: `url(${restaurant.imageUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101726] via-black/15 to-transparent" />
        <div className="absolute left-5 top-5 rounded-full bg-white/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-xl">
          {restaurant.discountText || restaurant.offerText}
        </div>
        <div className="absolute right-5 top-5 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-bold text-white shadow-lg">
          ID: {restaurant.id}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="font-display text-3xl font-bold">{restaurant.name}</p>
          <p className="mt-1 text-sm text-white/80">{restaurant.cuisine}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-5 border-t border-slate-200 bg-white p-6 text-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-600">{restaurant.location}</p>
            <p className="text-sm leading-7 text-slate-800">{restaurant.description}</p>
          </div>
          <span className="rounded-full bg-emerald-100/85 px-3 py-1 text-sm font-bold text-emerald-700 shadow-sm">{restaurant.rating} ★</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">{tag}</span>
          ))}
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
          <p className="font-semibold text-slate-800">Restaurant ID: {restaurant.id}</p>
          <p className="mt-1">{restaurant.etaMinutes} mins • Rs.{restaurant.deliveryFee} delivery</p>
          <p className="mt-1">Rs.{restaurant.priceForTwo} for two</p>
        </div>

        <Link
          to={`/menu/${restaurant.id}`}
          className="mt-auto inline-flex w-full items-center justify-center rounded-[20px] bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-200"
        >
          View Restaurant
        </Link>
      </div>
    </div>
  );
}

export default RestaurantCard;
