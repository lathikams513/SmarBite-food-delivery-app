import { useMemo } from 'react';

const FOOD_OPTIONS = [
  { id: 'pizza', label: 'Pizza', icon: '🍕' },
  { id: 'burger', label: 'Burger', icon: '🍔' },
  { id: 'biryani', label: 'Biryani', icon: '🍛' },
  { id: 'dosa', label: 'Dosa', icon: '🥞' },
  { id: 'fries', label: 'Fries', icon: '🍟' },
  { id: 'icecream', label: 'Ice Cream', icon: '🍨' }
];

const PARTICLES = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  left: `${(index * 17) % 100}%`,
  top: `${(index * 23) % 100}%`,
  delay: `${(index % 7) * 1.2}s`,
  duration: `${14 + (index % 6) * 3}s`,
  scale: 0.8 + ((index % 5) * 0.08)
}));

function FloatingFoodBackground({ selectedFood, onSelect }) {
  const activeFood = useMemo(
    () => FOOD_OPTIONS.find((food) => food.id === selectedFood) || FOOD_OPTIONS[0],
    [selectedFood]
  );

  return (
    <>
      <div className="floating-food-scene" aria-hidden="true">
        {PARTICLES.map((particle) => (
          <span
            key={particle.id}
            className="floating-food-item"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              '--food-scale': particle.scale
            }}
          >
            {activeFood.icon}
          </span>
        ))}
      </div>

      <div className="fixed bottom-5 right-5 z-40 w-[min(92vw,340px)] rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-500">SmartBite Mood</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">Enter your fav food</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">Choose one food. App full background la adhu cute floating style la move aagum.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {FOOD_OPTIONS.map((food) => (
            <button
              key={food.id}
              type="button"
              onClick={() => onSelect(food.id)}
              className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                selectedFood === food.id
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="mr-2">{food.icon}</span>
              {food.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default FloatingFoodBackground;
