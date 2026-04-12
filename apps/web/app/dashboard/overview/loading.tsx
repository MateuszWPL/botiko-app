export default function OverviewLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-8 w-36 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-56 bg-slate-100 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-200 mb-3" />
            <div className="h-7 w-10 bg-slate-200 rounded mb-1.5" />
            <div className="h-3.5 w-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      <div className="h-4 w-28 bg-slate-200 rounded mb-3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-28 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-40 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <div className="h-4 w-40 bg-slate-200 rounded mb-1.5" />
            <div className="h-3 w-32 bg-slate-100 rounded mb-5" />
            <div className="h-44 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
