'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase';

const NAV_ITEMS = [
  { href: '/dashboard/overview', label: 'Przegląd', icon: '📊' },
  { href: '/dashboard/leads', label: 'Leady', icon: '👥' },
  { href: '/dashboard/conversations', label: 'Rozmowy', icon: '💬' },
  { href: '/dashboard/knowledge', label: 'Baza wiedzy', icon: '📚' },
  { href: '/dashboard/settings', label: 'Ustawienia', icon: '⚙️' },
  { href: '/dashboard/embed', label: 'Instalacja', icon: '🔌' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-800">
        <span className="text-lg font-bold text-white">Botiko.pl</span>
        <p className="text-xs text-slate-400 mt-0.5">Panel zarządzania</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => void handleLogout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span>🚪</span>
          Wyloguj
        </button>
      </div>
    </aside>
  );
}
