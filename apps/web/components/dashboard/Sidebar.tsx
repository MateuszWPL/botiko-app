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
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') setCollapsed(true);
    const done = localStorage.getItem('botiko_setup_done') === 'true';
    setSetupDone(done);
    setMounted(true);
  }, []);

  // Keep sidebar in sync when wizard marks setup as done
  useEffect(() => {
    const handler = () => setSetupDone(true);
    window.addEventListener('botiko:setup-done', handler);
    return () => window.removeEventListener('botiko:setup-done', handler);
  }, []);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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
        <div className="flex items-center justify-between gap-2 p-4 border-b border-slate-800/60 flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-3 min-w-0">
              <Image
                src="/BotikoLogo.png"
                alt="Botiko"
                width={32}
                height={32}
                className="rounded-lg flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent block whitespace-nowrap">
                  Botiko.pl
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="text-xs text-slate-500 whitespace-nowrap">Panel zarządzania</span>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all flex-shrink-0 cursor-pointer ${collapsed ? 'mx-auto' : ''}`}
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
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <div key={item.href} className="relative group/tip">
                <Link
                  href={item.href}
                  className={`flex items-center py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    collapsed ? 'justify-center px-2' : 'gap-3 px-3'
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
                  {!collapsed && (
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="truncate">{item.label}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                      )}
                    </div>
                  )}
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
                className={`w-full flex items-center py-2.5 rounded-xl text-sm font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all duration-150 cursor-pointer ${
                  collapsed ? 'justify-center px-2' : 'gap-3 px-3'
                }`}
              >
                <Rocket className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Konfiguracja bota</span>}
              </button>
              <Tooltip label="Konfiguracja bota" show={collapsed} />
            </div>
          </div>
        )}

        {/* Bottom: Plan badge + Logout */}
        <div className="p-3 border-t border-slate-800/60 space-y-2 flex-shrink-0">
          <div className={`relative group/tip flex items-center rounded-xl bg-slate-800/40 border border-slate-700/40 ${collapsed ? 'justify-center py-2 px-2' : 'gap-2 px-3 py-2'}`}>
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-3 h-3 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-300">Starter</p>
                <p className="text-xs text-slate-500 truncate">149 zł / mies.</p>
              </div>
            )}
            <Tooltip label="Plan Starter · 149 zł/mies." show={collapsed} />
          </div>

          <div className="relative group/tip">
            <button
              onClick={() => void handleLogout()}
              className={`w-full flex items-center py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all duration-150 group cursor-pointer ${
                collapsed ? 'justify-center px-2' : 'gap-3 px-3'
              }`}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Wyloguj się</span>}
            </button>
            <Tooltip label="Wyloguj się" show={collapsed} />
          </div>
        </div>
      </aside>

      {/* Mobile top header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/60 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
          aria-label="Otwórz menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Image src="/BotikoLogo.png" alt="Botiko" width={28} height={28} className="rounded-md" />
        <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          {NAV_ITEMS.find((i) => pathname.startsWith(i.href))?.label ?? 'Botiko.pl'}
        </span>
      </header>

      {/* Mobile drawer overlay */}
      <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <aside
          className={`absolute left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800/50 flex flex-col transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between gap-2 p-4 border-b border-slate-800/60 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Image src="/BotikoLogo.png" alt="Botiko" width={32} height={32} className="rounded-lg" />
              <div>
                <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent block">
                  Botiko.pl
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-slate-500">Panel zarządzania</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all cursor-pointer"
              aria-label="Zamknij menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer nav */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Setup wizard */}
          {!setupDone && (
            <div className="px-3 pb-3">
              <button
                onClick={() => { setMobileOpen(false); window.dispatchEvent(new Event('botiko:open-wizard')); }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all cursor-pointer"
              >
                <Rocket className="w-5 h-5 flex-shrink-0" />
                <span>Konfiguracja bota</span>
              </button>
            </div>
          )}

          {/* Drawer footer */}
          <div className="p-3 border-t border-slate-800/60 space-y-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-300">Plan Starter</p>
                <p className="text-xs text-slate-500">149 zł / mies.</p>
              </div>
            </div>
            <button
              onClick={() => void handleLogout()}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Wyloguj się</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
