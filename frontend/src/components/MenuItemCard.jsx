function MenuItemCard({ item, onAddToCart, addLabel = 'Add to Cart' }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-soft transition duration-300 hover:shadow-[0_24px_60px_rgba(252,128,25,0.12)]">
      <div className="space-y-5 p-5">
        <div className="relative h-52 overflow-hidden rounded-[24px] bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }}>
          {item.discountPercent > 0 && (
            <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 shadow">
              {item.discountPercent}% OFF
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-900">{item.name}</h3>
              <p className="mt-1 text-sm font-semibold text-brand-600">Rs.{item.price}</p>
            </div>
            <button type="button" onClick={() => onAddToCart(item)} className="rounded-[18px] bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-200">
              {addLabel}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item.category}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isVeg ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
            {item.bestseller && <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Bestseller</span>}
            {item.itemTag && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{item.itemTag}</span>}
          </div>

          <p className="text-sm leading-7 text-slate-600">{item.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">{item.calories} kcal</div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{item.prepTimeMinutes} mins</div>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;
