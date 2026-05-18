'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, Sparkles, AlertTriangle, UserPlus, Zap, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { createClient } from '../../../lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const READ_KEY = 'botiko:notif-read-ts';
const PLAN_LIMIT = 1000;

type NotifKind = 'lead' | 'trial' | 'limit';

interface Notification {
  id: string;
  kind: NotifKind;
  title: string;
  message: string;
  href: string;
  ts: number;
  severity: 'info' | 'warn' | 'danger';
}

const KIND_META: Record<NotifKind, { Icon: LucideIcon; tint: string }> = {
  lead:  { Icon: UserPlus,      tint: 'bg-indigo-50 text-indigo-600' },
  trial: { Icon: AlertTriangle, tint: 'bg-amber-50 text-amber-600' },
  limit: { Icon: TrendingUp,    tint: 'bg-rose-50 text-rose-600' },
};

function timeAgo(ts: number): string {
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return 'przed chwilą';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min temu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} godz. temu`;
  const day = Math.floor(hr / 24);
  return `${day} dni temu`;
}

async function fetchJson<T>(path: string, token: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function buildNotifications(): Promise<Notification[]> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) return [];

  const [leads, billing, conversations] = await Promise.all([
    fetchJson<Array<{ id: string; name: string; status: string; createdAt: string }>>('/api/v1/leads', token),
    fetchJson<{ isActive: boolean; hasSubscription: boolean; trialEndsAt: string | null }>('/api/v1/billing/status', token),
    fetchJson<Array<{ id: string; createdAt: string }>>('/api/v1/conversations', token),
  ]);

  const out: Notification[] = [];
  const dayMs = 24 * 60 * 60 * 1000;

  // New leads from last 24h
  if (leads) {
    const fresh = leads
      .filter((l) => Date.now() - new Date(l.createdAt).getTime() < dayMs)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    for (const lead of fresh) {
      out.push({
        id: `lead:${lead.id}`,
        kind: 'lead',
        title: 'Nowy lead',
        message: `${lead.name} zostawił kontakt`,
        href: '/dashboard/leads',
        ts: new Date(lead.createdAt).getTime(),
        severity: 'info',
      });
    }
  }

  // Trial ending / expired
  if (billing && !billing.hasSubscription && billing.trialEndsAt) {
    const daysLeft = Math.ceil((new Date(billing.trialEndsAt).getTime() - Date.now()) / dayMs);
    if (daysLeft <= 0) {
      out.push({
        id: 'trial:expired',
        kind: 'trial',
        title: 'Trial wygasł',
        message: 'Bot jest nieaktywny — aktywuj plan, aby dalej obsługiwał klientów',
        href: '/dashboard/billing',
        ts: new Date(billing.trialEndsAt).getTime(),
        severity: 'danger',
      });
    } else if (daysLeft <= 5) {
      out.push({
        id: `trial:${daysLeft}`,
        kind: 'trial',
        title: `Zostało ${daysLeft} ${daysLeft === 1 ? 'dzień' : 'dni'} trialu`,
        message: 'Po zakończeniu trialu bot przestanie odpowiadać klientom',
        href: '/dashboard/billing',
        ts: Date.now(),
        severity: daysLeft <= 2 ? 'danger' : 'warn',
      });
    }
  }

  // Plan usage
  if (conversations) {
    const now = new Date();
    const thisMonth = conversations.filter((c) => {
      const d = new Date(c.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const pct = Math.round((thisMonth.length / PLAN_LIMIT) * 100);

    if (pct >= 90) {
      out.push({
        id: `limit:critical`,
        kind: 'limit',
        title: `Limit planu: ${pct}%`,
        message: `Wykorzystano ${thisMonth.length}/${PLAN_LIMIT} rozmów w tym miesiącu`,
        href: '/dashboard/billing',
        ts: Date.now(),
        severity: 'danger',
      });
    } else if (pct >= 80) {
      out.push({
        id: `limit:high`,
        kind: 'limit',
        title: 'Zbliżasz się do limitu planu',
        message: `${thisMonth.length}/${PLAN_LIMIT} rozmów wykorzystanych`,
        href: '/dashboard/billing',
        ts: Date.now(),
        severity: 'warn',
      });
    }
  }

  return out.sort((a, b) => b.ts - a.ts);
}

function NotifRow({ notif, onClick }: { notif: Notification; onClick: () => void }) {
  const { Icon, tint } = KIND_META[notif.kind];
  return (
    <Link
      href={notif.href}
      onClick={onClick}
      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tint}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-800 truncate">{notif.title}</p>
          <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5 whitespace-nowrap">
            {timeAgo(notif.ts)}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
      </div>
    </Link>
  );
}

export function NotificationsBell() {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [lastReadTs, setLastReadTs] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(READ_KEY) : null;
    setLastReadTs(raw ? parseInt(raw, 10) : 0);
  }, []);

  useEffect(() => {
    let mounted = true;
    void buildNotifications().then((n) => { if (mounted) setItems(n); });
    const id = setInterval(() => {
      void buildNotifications().then((n) => { if (mounted) setItems(n); });
    }, 60_000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const unread = items.filter((n) => n.ts > lastReadTs).length;

  const markAllRead = () => {
    const now = Date.now();
    setLastReadTs(now);
    localStorage.setItem(READ_KEY, String(now));
  };

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) markAllRead();
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={handleToggle}
        aria-label="Powiadomienia"
        className="relative p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-sm">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(360px,calc(100vw-1rem))] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-transparent">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-semibold text-slate-800">Powiadomienia</span>
            </div>
            {items.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-medium text-indigo-500 hover:text-indigo-700 cursor-pointer"
              >
                Oznacz jako przeczytane
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-700">Wszystko pod kontrolą</p>
                <p className="text-xs text-slate-500 mt-1">Nie masz nowych powiadomień</p>
              </div>
            ) : (
              items.map((n) => <NotifRow key={n.id} notif={n} onClick={() => setOpen(false)} />)
            )}
          </div>

          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
            <Link
              href="/dashboard/billing"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-indigo-600 font-medium"
            >
              <Zap className="w-3 h-3" />
              Zarządzaj subskrypcją
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
