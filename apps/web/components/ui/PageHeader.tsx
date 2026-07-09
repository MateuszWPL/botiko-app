interface PageHeaderProps {
  /** Unused, tytuł renderuje DashboardTopBar. Prop zostawiony dla zgodności. */
  title?: string;
  /** Unused, opis renderuje DashboardTopBar. Prop zostawiony dla zgodności. */
  description?: string;
  badge?: { label: string; color?: string };
  action?: React.ReactNode;
}

export function PageHeader({ badge, action }: PageHeaderProps) {
  if (!badge && !action) return null;
  return (
    <div className="flex items-center justify-end gap-3 mb-4">
      {badge && (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            badge.color ?? 'bg-indigo-100 text-indigo-700'
          }`}
        >
          {badge.label}
        </span>
      )}
      {action}
    </div>
  );
}
