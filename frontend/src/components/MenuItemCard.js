function MenuItemCard({ item, onAddToCart }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-soft">
      <div className="grid gap-4 p-5 md:grid-cols-[130px,1fr]">
        <div className="h-28 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }} />
        <div className="flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-slate-900">{item.name}</h3>
              <span className="text-lg font-extrabold text-brand-600">₹{item.price}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{item.category} • {item.isVeg ? 'Veg' : 'Non-Veg'}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">{item.calories} kcal</div>
            <button type="button" onClick={() => onAddToCart(item)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;
