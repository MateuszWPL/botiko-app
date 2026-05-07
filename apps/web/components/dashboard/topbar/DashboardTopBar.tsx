'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
          const status = (await res.json()) as {
            isActive: boolean;
            hasSubscription: boolean;
            trialEndsAt: string | null;
          };
          // Derive effective state from date — cron may not have run yet.
          const trialExpired =
            !status.hasSubscription &&
            !!status.trialEndsAt &&
            new Date(status.trialEndsAt).getTime() <= Date.now();
          if (mounted) setBotActive(status.isActive && !trialExpired);
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
      <div className="mx-auto w-full max-w-[1600px] 2xl:max-w-[2000px] min-[2200px]:max-w-[2400px] min-[2800px]:max-w-[2600px] px-4 md:px-8 py-4 md:py-5 flex items-center gap-6">
        {/* Left side — title + greeting */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate">{title}</h1>
            </div>
            <Link
              href="/dashboard/billing"
              className={`hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all duration-150 cursor-pointer ${
                botActive
                  ? 'bg-slate-50 border-slate-200/80 hover:bg-emerald-50 hover:border-emerald-200'
                  : 'bg-rose-50 border-rose-200/80 hover:bg-rose-100 hover:border-rose-300'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${botActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}
              />
              <span className={`text-[11px] font-medium ${botActive ? 'text-slate-600' : 'text-rose-600'}`}>
                {botActive ? 'Bot aktywny' : 'Bot nieaktywny'}
              </span>
            </Link>
          </div>

          <p className="text-xs md:text-[13px] text-slate-500 leading-relaxed truncate">
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
