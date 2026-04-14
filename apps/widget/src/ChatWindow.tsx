import { useEffect, useRef, useState } from 'preact/hooks';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LeadFormState {
  visible: boolean;
  name: string;
  phone: string;
  consent: boolean;
  submitted: boolean;
  loading: boolean;
}

interface ChatWindowProps {
  botId: string;
  botName: string;
  primaryColor: string;
  welcomeMessage: string;
  isOpen: boolean;
  apiUrl: string;
  onClose: () => void;
  offlineMessage: string | null;
  businessHoursStart: number | null;
  businessHoursEnd: number | null;
  businessDays: number[];
  suggestedQuestions: string[];
}

interface ApiChatResponse {
  message?: string;
  showLeadForm?: boolean;
}

interface SessionData {
  sessionId: string;
  messages: Message[];
  userMessageCount: number;
  leadSubmitted: boolean;
}

function checkIsOffline(start: number | null, end: number | null, days: number[]): boolean {
  if (start === null || end === null || days.length === 0) return false;
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  if (!days.includes(day)) return true;
  return hour < start || hour >= end;
}

function generateSessionId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadSession(botId: string, welcomeMessage: string): SessionData {
  try {
    const raw = sessionStorage.getItem(`botiko_${botId}`);
    if (raw) {
      const data = JSON.parse(raw) as Partial<SessionData>;
      if (data.sessionId && Array.isArray(data.messages) && data.messages.length > 0) {
        return {
          sessionId: data.sessionId,
          messages: data.messages,
          userMessageCount: data.userMessageCount ?? 0,
          leadSubmitted: data.leadSubmitted ?? false,
        };
      }
    }
  } catch {
    // ignore — use defaults
  }
  return {
    sessionId: generateSessionId(),
    messages: [{ role: 'assistant', content: welcomeMessage }],
    userMessageCount: 0,
    leadSubmitted: false,
  };
}

function saveSession(botId: string, data: SessionData): void {
  try {
    sessionStorage.setItem(`botiko_${botId}`, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable (private mode, quota exceeded) — ignore
  }
}


const CHAT_TIMEOUT_MS = 30_000;

export function ChatWindow({
  botId,
  botName,
  primaryColor,
  welcomeMessage,
  isOpen,
  apiUrl,
  onClose,
  offlineMessage,
  businessHoursStart,
  businessHoursEnd,
  businessDays,
  suggestedQuestions,
}: ChatWindowProps) {
  const isOffline = checkIsOffline(businessHoursStart, businessHoursEnd, businessDays);
  const initial = loadSession(botId, welcomeMessage);

  const [sessionId] = useState<string>(initial.sessionId);
  const [messages, setMessages] = useState<Message[]>(initial.messages);
  const [userMessageCount, setUserMessageCount] = useState<number>(initial.userMessageCount);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lead, setLead] = useState<LeadFormState>({
    visible: false,
    name: '',
    phone: '',
    consent: false,
    submitted: initial.leadSubmitted,
    loading: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  // Show quick suggestions only before first user message
  const showSuggestions = userMessageCount === 0 && !isOffline;

  useEffect(() => {
    saveSession(botId, {
      sessionId,
      messages,
      userMessageCount,
      leadSubmitted: lead.submitted,
    });
  }, [botId, sessionId, messages, userMessageCount, lead.submitted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens on desktop
  useEffect(() => {
    if (isOpen && !isMobile) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, isMobile]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading || isOffline) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);
      let res: Response;
      try {
        res = await fetch(`${apiUrl}/api/v1/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ botId, sessionId, message: content }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }
      const data = (await res.json()) as ApiChatResponse;

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message ?? 'Przepraszam, coś poszło nie tak.' },
      ]);

      setUserMessageCount((n) => n + 1);

      if (data.showLeadForm && !lead.submitted) {
        setLead((s) => ({ ...s, visible: true }));
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Przepraszam, wystąpił błąd połączenia. Spróbuj ponownie.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitLead = async () => {
    if (!lead.name.trim() || !lead.phone.trim() || !lead.consent) return;
    setLead((s) => ({ ...s, loading: true }));

    try {
      await fetch(`${apiUrl}/api/v1/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId,
          name: lead.name.trim(),
          phone: lead.phone.trim(),
          consentGiven: true,
        }),
      });
      setLead((s) => ({ ...s, submitted: true, loading: false, visible: false }));
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Dziękuję! Twoje dane zostały zapisane. Odezwiemy się wkrótce!' },
      ]);
    } catch {
      setLead((s) => ({ ...s, loading: false }));
    }
  };

  if (!isOpen) return null;

  const windowStyle = isMobile
    ? { position: 'fixed' as const, inset: '0', width: '100%', height: '100%', borderRadius: '0' }
    : { position: 'fixed' as const, bottom: '92px', right: '24px', width: '360px', height: '540px', borderRadius: '16px' };

  // Avatar: first letter of bot name
  const avatarLetter = botName.trim()[0]?.toUpperCase() ?? 'B';

  return (
    <div
      style={{
        ...windowStyle,
        backgroundColor: '#fff',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2147483646,
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        animation: 'botiko-fadein 0.2s ease',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          backgroundColor: `var(--botiko-primary, ${primaryColor})`,
          color: '#fff',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
        }}
      >
        {/* Bot avatar */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 700,
          flexShrink: 0,
          border: '2px solid rgba(255,255,255,0.3)',
        }}>
          {avatarLetter}
        </div>

        {/* Name + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '14px', lineHeight: 1.2 }}>{botName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isOffline ? '#fbbf24' : '#4ade80',
              flexShrink: 0,
              animation: isOffline ? 'none' : 'botiko-pulse 2s ease infinite',
            }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
              {isOffline ? 'Poza godzinami pracy' : 'Online · odpowiada błyskawicznie'}
            </span>
          </div>
        </div>

        {/* Close button (mobile) or minimize (desktop) */}
        <button
          onClick={onClose}
          aria-label="Zamknij"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Offline banner ── */}
      {isOffline && offlineMessage && (
        <div style={{
          backgroundColor: '#fef9c3',
          borderBottom: '1px solid #fde047',
          padding: '8px 14px',
          fontSize: '12px',
          color: '#854d0e',
          lineHeight: '1.4',
          flexShrink: 0,
        }}>
          {offlineMessage}
        </div>
      )}

      {/* ── Messages ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '14px 12px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end',
            gap: '6px',
          }}>
            {/* Bot avatar dot for assistant messages */}
            {msg.role === 'assistant' && (
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: `var(--botiko-primary, ${primaryColor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
                marginBottom: '2px',
              }}>
                {avatarLetter}
              </div>
            )}
            <div style={{
              maxWidth: '78%',
              padding: '9px 13px',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
              backgroundColor: msg.role === 'user'
                ? `var(--botiko-primary, ${primaryColor})`
                : '#f1f5f9',
              color: msg.role === 'user' ? '#fff' : '#0f172a',
              fontSize: '14px',
              lineHeight: '1.5',
              wordBreak: 'break-word',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              backgroundColor: `var(--botiko-primary, ${primaryColor})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {avatarLetter}
            </div>
            <div style={{
              padding: '10px 14px',
              borderRadius: '4px 14px 14px 14px',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  backgroundColor: '#94a3b8',
                  animation: 'botiko-bounce 1.2s ease infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Quick suggestions — show before first message */}
        {showSuggestions && !isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '4px' }}>
            {suggestedQuestions.map((s) => (
              <button
                key={s}
                onClick={() => void sendMessage(s)}
                style={{
                  alignSelf: 'flex-start',
                  padding: '7px 13px',
                  borderRadius: '20px',
                  border: `1.5px solid var(--botiko-primary, ${primaryColor})`,
                  backgroundColor: 'transparent',
                  color: `var(--botiko-primary, ${primaryColor})`,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  lineHeight: 1.3,
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    `var(--botiko-primary, ${primaryColor})`;
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color =
                    `var(--botiko-primary, ${primaryColor})`;
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Lead form (inline) ── */}
      {lead.visible && !lead.submitted && (
        <div style={{
          padding: '12px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
            Zostaw swój kontakt
          </div>
          <input type="text" placeholder="Imię i nazwisko" value={lead.name}
            onInput={(e) => setLead((s) => ({ ...s, name: (e.target as HTMLInputElement).value }))}
            style={inputStyle}
          />
          <input type="tel" placeholder="Numer telefonu" value={lead.phone}
            onInput={(e) => setLead((s) => ({ ...s, phone: (e.target as HTMLInputElement).value }))}
            style={{ ...inputStyle, marginTop: '6px' }}
          />
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '8px', fontSize: '11px', color: '#64748b', cursor: 'pointer' }}>
            <input type="checkbox" checked={lead.consent}
              onChange={(e) => setLead((s) => ({ ...s, consent: (e.target as HTMLInputElement).checked }))}
              style={{ marginTop: '2px', flexShrink: 0 }}
            />
            Wyrażam zgodę na przetwarzanie moich danych osobowych.{' '}
            <a href="https://botiko.pl/prywatnosc" target="_blank" rel="noopener noreferrer"
              style={{ color: '#6366F1', textDecoration: 'underline' }}
              onClick={(e) => e.stopPropagation()}
            >
              Polityka prywatności
            </a>
          </label>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            <button
              onClick={() => void submitLead()}
              disabled={lead.loading || !lead.name.trim() || !lead.phone.trim() || !lead.consent}
              style={{
                ...btnStyle(primaryColor), flex: 1,
                opacity: (lead.loading || !lead.name.trim() || !lead.phone.trim() || !lead.consent) ? 0.6 : 1,
              }}
            >
              {lead.loading ? '...' : 'Wyślij'}
            </button>
            <button
              onClick={() => setLead((s) => ({ ...s, visible: false }))}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: '13px', cursor: 'pointer', color: '#64748b' }}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {/* ── Input area ── */}
      <div style={{
        padding: '10px 12px',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        gap: '6px',
        alignItems: 'flex-end',
        flexShrink: 0,
        backgroundColor: '#fff',
      }}>
        {/* Lead form button */}
        {!lead.visible && !lead.submitted && userMessageCount >= 2 && (
          <button
            onClick={() => setLead((s) => ({ ...s, visible: true }))}
            title="Zostaw kontakt"
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            📞
          </button>
        )}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isOffline) {
              e.preventDefault();
              void sendMessage();
            }
          }}
          placeholder={isOffline ? 'Poza godzinami pracy…' : 'Napisz wiadomość...'}
          maxLength={1000}
          disabled={isOffline}
          style={{ ...inputStyle, flex: 1, opacity: isOffline ? 0.5 : 1 }}
        />
        <button
          onClick={() => void sendMessage()}
          disabled={isLoading || !input.trim() || isOffline}
          style={{
            ...btnStyle(primaryColor),
            opacity: isLoading || !input.trim() || isOffline ? 0.6 : 1,
            flexShrink: 0,
            width: '36px',
            height: '36px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      {/* ── Footer ── */}
      <div style={{
        textAlign: 'center',
        padding: '5px',
        fontSize: '11px',
        color: '#cbd5e1',
        flexShrink: 0,
        backgroundColor: '#fff',
      }}>
        Powered by{' '}
        <a href="https://botiko.pl" target="_blank" rel="noopener noreferrer"
          style={{ color: '#94a3b8', textDecoration: 'none' }}
        >
          Botiko.pl
        </a>
      </div>

      <style>{`
        @keyframes botiko-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes botiko-bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes botiko-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box' as const,
  fontFamily: 'inherit',
};

function btnStyle(color: string) {
  return {
    padding: '8px 14px',
    borderRadius: '8px',
    backgroundColor: `var(--botiko-primary, ${color})`,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
  };
}
