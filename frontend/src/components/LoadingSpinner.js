function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 rounded-full bg-white/80 px-5 py-3 shadow-soft">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" />
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
