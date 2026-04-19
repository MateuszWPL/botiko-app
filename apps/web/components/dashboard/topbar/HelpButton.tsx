'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HelpCircle } from 'lucide-react';

export function HelpButton() {
  const pathname = usePathname();
  const active = pathname.startsWith('/dashboard/help');
  return (
    <Link
      href="/dashboard/help"
      aria-label="Pomoc"
      className={`p-2 rounded-xl border bg-white transition-all cursor-pointer ${
        active
          ? 'border-indigo-300 text-indigo-600 shadow-sm'
          : 'border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-sm'
      }`}
    >
      <HelpCircle className="w-4 h-4" />
    </Link>
  );
}
