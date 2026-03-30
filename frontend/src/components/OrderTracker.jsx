const statusSteps = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];

function OrderTracker({ status }) {
  const currentIndex = statusSteps.indexOf(status);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {statusSteps.map((step, index) => {
        const active = index <= currentIndex;
        return (
          <div key={step} className="flex items-center gap-3">
            <div className={`rounded-full px-3 py-1 text-xs font-bold ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
              {step}
            </div>
            {index < statusSteps.length - 1 && <div className={`h-1 w-10 rounded-full ${index < currentIndex ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default OrderTracker;
