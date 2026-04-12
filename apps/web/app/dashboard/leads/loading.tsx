export default function LeadsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-8 w-24 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-44 bg-slate-100 rounded" />
        </div>
        <div className="h-6 w-20 bg-slate-200 rounded-full" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        <div className="bg-slate-50/80 px-5 py-3.5 flex gap-8 border-b border-slate-200/60">
          {[80, 72, 160, 72, 64].map((w, i) => (
            <div key={i} className={`h-3.5 bg-slate-200 rounded`} style={{ width: w }} />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-5 py-4 border-b border-slate-100 flex items-center gap-8">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-4 w-24 bg-slate-100 rounded font-mono" />
            <div className="h-4 w-40 bg-slate-100 rounded hidden md:block" />
            <div className="h-6 w-24 bg-slate-200 rounded-full" />
            <div className="h-4 w-16 bg-slate-100 rounded hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
