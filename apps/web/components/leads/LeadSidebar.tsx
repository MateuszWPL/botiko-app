'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Phone, MessageSquare, User } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

interface Lead {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  status: string;
  botId: string;
  sessionId: string | null;
  createdAt: string;
}

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface ConversationDetail {
  id: string;
  messages: Message[];
}

interface LeadSidebarProps {
  lead: Lead | null;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'Nowy' },
  { value: 'CONTACTED', label: 'Skontaktowany' },
  { value: 'CONVERTED', label: 'Skonwertowany' },
  { value: 'LOST', label: 'Utracony' },
];

const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-indigo-500',
  'bg-blue-500',
  'bg-cyan-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-fuchsia-500',
];

function avatarColor(name: string): string {
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  const months = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
  return `${d.getDate()} ${months[d.getMonth()]}, ${formatTime(iso)}`;
}

export function LeadSidebar({ lead, onClose, onStatusChange }: LeadSidebarProps) {
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [convLoading, setConvLoading] = useState(false);
  const [status, setStatus] = useState(lead?.status ?? 'NEW');
  // Slide animation state, panel is always mounted when lead is set
  const [isVisible, setIsVisible] = useState(false);
  // Keep last lead in memory so content stays during close animation
  const [displayLead, setDisplayLead] = useState<Lead | null>(lead);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle open/close animation
  useEffect(() => {
    if (lead) {
      setDisplayLead(lead);
      // Small delay so the browser renders the panel before transition starts
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
      // Keep displayLead alive during slide-out (300ms)
      const t = setTimeout(() => setDisplayLead(null), 320);
      return () => clearTimeout(t);
    }
  }, [lead]);

  // Load conversation when lead changes
  useEffect(() => {
    if (!lead) return;
    setStatus(lead.status);
    setConversation(null);
    if (!lead.sessionId) return;

    setConvLoading(true);
    fetch(`/api/conversations/by-session?sessionId=${encodeURIComponent(lead.sessionId)}`)
      .then((r) => r.json())
      .then((data: ConversationDetail | null) => setConversation(data))
      .catch(() => setConversation(null))
      .finally(() => setConvLoading(false));
  }, [lead?.id, lead?.sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    if (displayLead) onStatusChange(displayLead.id, newStatus);
  };

  if (!displayLead) return null;

  const initials = getInitials(displayLead.name);
  const color = avatarColor(displayLead.name);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div className={`w-11 h-11 rounded-full ${color} text-white text-sm font-bold flex items-center justify-center flex-shrink-0`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-slate-900 truncate">{displayLead.name}</p>
            <p className="text-sm text-slate-500 truncate">{displayLead.phone}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <a
            href={`tel:${displayLead.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Phone className="w-4 h-4 flex-shrink-0" />
            Zadzwoń
          </a>
          <a
            href={`sms:${displayLead.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            SMS
          </a>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="ml-auto text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Lead info */}
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Dane leada</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2 flex-wrap">
                <span className="text-slate-400 w-20 flex-shrink-0">Data:</span>
                <span className="text-slate-700">{formatDateShort(displayLead.createdAt)}</span>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <span className="text-slate-400 w-20 flex-shrink-0">Status:</span>
                <StatusBadge status={status} />
              </div>
              {displayLead.message && (
                <div className="flex gap-2">
                  <span className="text-slate-400 w-20 flex-shrink-0 mt-0.5">Notatka:</span>
                  <span className="text-slate-700 italic text-xs leading-relaxed">{displayLead.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Conversation */}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Rozmowa z botem
            </p>

            {!displayLead.sessionId ? (
              <p className="text-sm text-slate-400 italic">Lead dodany ręcznie, brak rozmowy z botem</p>
            ) : convLoading ? (
              <p className="text-sm text-slate-400">Ładowanie rozmowy...</p>
            ) : !conversation || conversation.messages.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Brak wiadomości</p>
            ) : (
              <div className="space-y-3">
                {conversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                        msg.role === 'USER'
                          ? 'bg-indigo-600 text-white rounded-br-sm'
                          : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
