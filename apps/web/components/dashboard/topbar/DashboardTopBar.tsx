'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { createClient } from '../../../lib/supabase';
import { getTopBarMeta } from './topbar-meta';
import { NotificationsBell } from './NotificationsBell';
import { HelpButton } from './HelpButton';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function greetingByHour(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Dobrej nocy';
  if (h < 12) return 'Dzień dobry';
  if (h < 18) return 'Miłego dnia';
  return 'Dobry wieczór';
}

function firstName(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // If it looks like an email, pull the local part and take chars before separator
  if (trimmed.includes('@')) {
    const local = trimmed.split('@')[0] ?? '';
    const cleaned = local.replace(/[._-]/g, ' ').trim();
    if (!cleaned) return null;
    const first = cleaned.split(/\s+/)[0] ?? '';
    return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : null;
  }
  const first = trimmed.split(/\s+/)[0] ?? '';
  return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : null;
}

export function DashboardTopBar() {
  const pathname = usePathname();
  const { title, description, icon: Icon } = getTopBarMeta(pathname);

  const [userName, setUserName] = useState<string | null>(null);
  const [botActive, setBotActive] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      const fullName =
        (user?.user_metadata?.full_name as string | undefined) ??
        (user?.user_metadata?.name as string | undefined) ??
        user?.email ??
        null;
      setUserName(firstName(fullName));

      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/v1/billing/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const status = (await res.json()) as { isActive: boolean };
          if (mounted) setBotActive(status.isActive !== false);
        }
      } catch {
        // silent — fall back to default
      }
    })();
    return () => { mounted = false; };
  }, []);

  const greeting = userName ? `${greetingByHour()}, ${userName}` : greetingByHour();

  return (
    <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/70">
      <div className="mx-auto w-full max-w-[1600px] 2xl:max-w-[2000px] min-[2200px]:max-w-[2400px] min-[2800px]:max-w-[2600px] px-4 md:px-8 py-3 md:py-4 flex items-center gap-4">
        {/* Left side — breadcrumb + title + greeting */}
        <div className="min-w-0 flex-1">
          <nav className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mb-0.5" aria-label="breadcrumb">
            <Link href="/dashboard/overview" className="hover:text-indigo-500 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-600">{title}</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate">{title}</h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200/80">
              <span
                className={`w-1.5 h-1.5 rounded-full ${botActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}
              />
              <span className="text-[10px] font-medium text-slate-600">
                {botActive ? 'Bot aktywny' : 'Bot nieaktywny'}
              </span>
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-0.5 truncate">
            <span className="font-medium text-slate-600">{greeting}</span>
            <span className="hidden sm:inline"> · {description}</span>
          </p>
        </div>

        {/* Right side — Help + Notifications */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <HelpButton />
          <NotificationsBell />
        </div>
      </div>
    </div>
  );
}
