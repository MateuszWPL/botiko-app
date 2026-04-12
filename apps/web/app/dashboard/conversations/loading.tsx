export default function ConversationsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-8 w-28 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-52 bg-slate-100 rounded" />
        </div>
        <div className="h-6 w-20 bg-slate-200 rounded-full" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm divide-y divide-slate-100/80">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-slate-200 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-48 bg-slate-200 rounded mb-1.5" />
              <div className="h-3 w-32 bg-slate-100 rounded" />
            </div>
            <div className="w-4 h-4 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
