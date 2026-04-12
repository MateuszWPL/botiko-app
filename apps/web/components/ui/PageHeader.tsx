interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: { label: string; color?: string };
  action?: React.ReactNode;
}

export function PageHeader({ title, description, badge, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && (
          <p className="text-slate-500 text-sm mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {badge && (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.color ?? 'bg-indigo-100 text-indigo-700'}`}>
            {badge.label}
          </span>
        )}
        {action}
      </div>
    </div>
  );
}
