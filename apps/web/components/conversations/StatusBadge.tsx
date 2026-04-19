type ConversationStatus = 'Aktywna' | 'Lead' | 'Zakończona';

interface StatusBadgeProps {
  status: ConversationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<
    ConversationStatus,
    { bg: string; text: string; dot: string; label: string }
  > = {
    Aktywna: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      label: 'Aktywna',
    },
    Lead: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      label: 'Lead',
    },
    Zakończona: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
      label: 'Zakończona',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text} text-xs font-medium`}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
}
