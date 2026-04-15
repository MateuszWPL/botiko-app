'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BookOpen,
  Settings,
  Code2,
  CreditCard,
  LogOut,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  Rocket,
} from 'lucide-react';
import { createClient } from '../../lib/supabase';

const NAV_ITEMS = [
  { href: '/dashboard/overview', label: 'Przegląd', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leady', icon: Users },
  { href: '/dashboard/conversations', label: 'Rozmowy', icon: MessageSquare },
  { href: '/dashboard/knowledge', label: 'Baza wiedzy', icon: BookOpen },
  { href: '/dashboard/settings', label: 'Ustawienia', icon: Settings },
  { href: '/dashboard/embed', label: 'Instalacja', icon: Code2 },
  { href: '/dashboard/billing', label: 'Płatności', icon: CreditCard },
];

function Tooltip({ label, show }: { label: string; show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-[100] shadow-lg border border-slate-700/50">
      {label}
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [setupDone, setSetupDone] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') setCollapsed(true);
    const done = localStorage.getItem('botiko_setup_done') === 'true';
    setSetupDone(done);
    setMounted(true);
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar-collapsed', String(next));
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Avoid width flash on hydration
  const sidebarWidth = !mounted ? 'w-64' : collapsed ? 'w-16' : 'w-64';

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800/50 overflow-hidden transition-[width] duration-300 ease-in-out ${sidebarWidth}`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2 p-4 border-b border-slate-800/60 flex-shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex items-center gap-3 min-w-0 ${collapsed ? 'w-8' : ''}`}>
            <Image
              src="/BotikoLogo.png"
              alt="Botiko"
              width={32}
              height={32}
              className="rounded-lg flex-shrink-0"
            />
            <div className={`min-w-0 transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent block">
                Botiko.pl
              </span>
              <div className="flex items-center gap-1 mt-0.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="text-xs text-slate-500 whitespace-nowrap truncate">Panel zarządzania</span>
              </div>
            </div>
          </div>
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all flex-shrink-0 cursor-pointer"
            title={collapsed ? 'Rozwiń sidebar' : 'Zwiń sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <div key={item.href} className="relative group/tip">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <div className={`flex items-center gap-2 min-w-0 flex-1 transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <span className="truncate">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    )}
                  </div>
                </Link>
                <Tooltip label={item.label} show={collapsed} />
              </div>
            );
          })}
        </nav>

        {/* Setup wizard trigger — shown only if setup not done */}
        {!setupDone && (
          <div className="px-3 pb-3">
            <div className="relative group/tip">
              <button
                onClick={() => window.dispatchEvent(new Event('botiko:open-wizard'))}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all duration-150 cursor-pointer ${
                  collapsed ? 'justify-center' : ''
                }`}
              >
                <Rocket className="w-4 h-4 flex-shrink-0" />
                <span className={`transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>Konfiguracja bota</span>
              </button>
              <Tooltip label="Konfiguracja bota" show={collapsed} />
            </div>
          </div>
        )}

        {/* Bottom: Plan badge + Logout */}
        <div className="p-3 border-t border-slate-800/60 space-y-2 flex-shrink-0">
          <div className={`relative group/tip flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/40 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <div className={`min-w-0 transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <p className="text-xs font-semibold text-slate-300">Starter</p>
              <p className="text-xs text-slate-500 truncate">149 zł / mies.</p>
            </div>
            <Tooltip label="Plan Starter · 149 zł/mies." show={collapsed} />
          </div>

          <div className="relative group/tip">
            <button
              onClick={() => void handleLogout()}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all duration-150 group cursor-pointer ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className={`transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>Wyloguj się</span>
            </button>
            <Tooltip label="Wyloguj się" show={collapsed} />
          </div>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800/60 flex items-center justify-around px-1 py-2">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-0 ${
                isActive
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs truncate font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
