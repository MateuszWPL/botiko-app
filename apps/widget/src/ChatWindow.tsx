import { useEffect, useRef, useState } from 'preact/hooks';
import {
  errorMessageForStatus,
  formatPhone,
  isSalonClosed,
  isValidPhone,
  loadSession,
  parseSseFrames,
  saveSession,
  ABORT_ERROR_MSG,
} from './widget-utils';

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
  error: string | null;
}

interface ChatWindowProps {
  botId: string;
  botName: string;
  primaryColor: string;
  welcomeMessage: string;
  isOpen: boolean;
  apiUrl: string;
  onClose: () => void;
  online: boolean;
  companyPhone: string | null;
  offlineMessage: string | null;
  businessHoursStart: number | null;
  businessHoursEnd: number | null;
  businessDays: number[];
  suggestedQuestions: string[];
  avatarEmoji: string;
}

const CHAT_TIMEOUT_MS = 30_000;
// Reveal-buffer pacing — uniform typewriter feel regardless of whether tokens
// arrive from OpenAI in small chunks or from a canned response as one blob.
const REVEAL_TICK_MS = 28;
const REVEAL_CHARS_PER_TICK = 2;

export function ChatWindow({
  botId,
  botName,
  primaryColor,
  welcomeMessage,
  isOpen,
  apiUrl,
  onClose,
  online,
  companyPhone,
  offlineMessage,
  businessHoursStart,
  businessHoursEnd,
  businessDays,
  suggestedQuestions,
  avatarEmoji,
}: ChatWindowProps) {
  // salonClosed: informational only — bot zawsze odpowiada 24/7
  const salonClosed = isSalonClosed(businessHoursStart, businessHoursEnd, businessDays);
  const initial = loadSession(botId, welcomeMessage);

  const [sessionId] = useState<string>(initial.sessionId);
  const [messages, setMessages] = useState<Message[]>(initial.messages);
  const [userMessageCount, setUserMessageCount] = useState<number>(initial.userMessageCount);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [lead, setLead] = useState<LeadFormState>({
    visible: false,
    name: '',
    phone: '',
    consent: false,
    submitted: initial.leadSubmitted,
    loading: false,
    error: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Reveal buffer for streaming: incoming tokens land in `pending` and a timer
  // drips them into the visible assistant message at a steady cadence. Decouples
  // OpenAI's bursty token rate from a smooth typewriter UX, and gives canned
  // responses (one-shot full text) the same gradual reveal.
  const revealRef = useRef<{
    pending: string;
    done: boolean;
    timer: number | null;
  }>({ pending: '', done: false, timer: null });
  // Reaktywne wykrywanie mobile — reaguje na obrót urządzenia
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Mobile: dopasuj okno do visualViewport, żeby przy otwartej klawiaturze
  // belka nagłówka została na górze, a kurczył się tylko obszar wiadomości
  // (input zostaje tuż nad klawiaturą) — zamiast przewijać całe okno w górę.
  const [viewport, setViewport] = useState<{ height: number; offsetTop: number } | null>(null);
  useEffect(() => {
    if (!isMobile || !isOpen || typeof window === 'undefined' || !window.visualViewport) {
      setViewport(null);
      return;
    }
    const vv = window.visualViewport;
    const update = () => setViewport({ height: vv.height, offsetTop: vv.offsetTop });
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, [isMobile, isOpen]);

  const [showSuggestions, setShowSuggestions] = useState(userMessageCount === 0);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const phoneValid = isValidPhone(lead.phone);

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

  // Klawiatura zmienia rozmiar viewportu — utrzymaj ostatnią wiadomość w polu widzenia
  useEffect(() => {
    if (viewport) messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [viewport]);

  // Focus input when chat opens on desktop
  useEffect(() => {
    if (isOpen && !isMobile) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, isMobile]);

  // Płynne zamknięcie: najpierw animacja fade-out, potem wywołanie onClose
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 220);
  };

  /** Drains the reveal buffer into the last assistant message at a steady cadence. */
  const startReveal = () => {
    if (revealRef.current.timer !== null) return;
    const tick = () => {
      const ref = revealRef.current;
      if (ref.pending.length === 0) {
        ref.timer = null;
        if (ref.done) setIsLoading(false);
        return;
      }
      const take = Math.min(REVEAL_CHARS_PER_TICK, ref.pending.length);
      const chunk = ref.pending.slice(0, take);
      ref.pending = ref.pending.slice(take);
      setMessages((prev) => {
        const next = prev.slice();
        const last = next[next.length - 1];
        if (last && last.role === 'assistant') {
          next[next.length - 1] = { ...last, content: last.content + chunk };
        }
        return next;
      });
      ref.timer = window.setTimeout(tick, REVEAL_TICK_MS);
    };
    revealRef.current.timer = window.setTimeout(tick, REVEAL_TICK_MS);
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    setInput('');
    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: 'user', content }]);
    setIsLoading(true);
    setUserMessageCount((n) => n + 1);
    revealRef.current = { pending: '', done: false, timer: null };

    try {
      const controller = new AbortController();
      // Timeout liczony do pierwszego tokenu — gdy stream już płynie, nie ucinamy go
      const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);
      let res: Response;
      try {
        res = await fetch(`${apiUrl}/api/v1/chat/stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
          body: JSON.stringify({ botId, sessionId, message: content }),
          signal: controller.signal,
        });
      } catch (err) {
        clearTimeout(timeoutId);
        const isTimeout = err instanceof Error && err.name === 'AbortError';
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: isTimeout
            ? ABORT_ERROR_MSG
            : 'Przepraszam, wystąpił błąd połączenia. Sprawdź internet i spróbuj ponownie.',
        }]);
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        clearTimeout(timeoutId);
        let errorCode: string | undefined;
        try { errorCode = ((await res.json()) as { code?: string }).code; } catch {}
        const errMsg = errorMessageForStatus(res.status, errorCode, () => {
          if (!lead.submitted) setLead((s) => ({ ...s, visible: true }));
        });
        setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }]);
        setIsLoading(false);
        return;
      }

      if (!res.body) {
        // Should not happen on supported browsers, but bail gracefully
        clearTimeout(timeoutId);
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: 'Mamy chwilową przerwę techniczną. Spróbuj za moment.',
        }]);
        setIsLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let firstDelta = true;
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const parsed = parseSseFrames(buf);
          buf = parsed.rest;
          for (const ev of parsed.events) {
            if (ev.type === 'delta' && ev.text) {
              if (firstDelta) {
                firstDelta = false;
                clearTimeout(timeoutId);
                // First delta = OpenAI started responding → open assistant bubble
                setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
              }
              revealRef.current.pending += ev.text;
              startReveal();
            } else if (ev.type === 'done') {
              revealRef.current.done = true;
              if (ev.showLeadForm && !lead.submitted) {
                setLead((s) => ({ ...s, visible: true }));
              }
            }
          }
        }
      } finally {
        clearTimeout(timeoutId);
      }

      // Stream ended without any delta → safety net, surface generic message
      if (firstDelta) {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: 'Mamy chwilową przerwę techniczną. Spróbuj za moment.',
        }]);
        setIsLoading(false);
      } else if (revealRef.current.pending.length === 0) {
        // Buffer already empty when stream closed — stop the spinner now
        setIsLoading(false);
      }
      // else: reveal loop will clear isLoading when buffer drains
    } catch (err) {
      const isTimeout = err instanceof Error && err.name === 'AbortError';
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: isTimeout
          ? ABORT_ERROR_MSG
          : 'Przepraszam, wystąpił błąd połączenia. Sprawdź internet i spróbuj ponownie.',
      }]);
      setIsLoading(false);
    }
  };

  // Sprzątanie reveal-timera przy unmount, żeby nie pisać do unmounted komponentu
  useEffect(() => {
    return () => {
      if (revealRef.current.timer !== null) {
        window.clearTimeout(revealRef.current.timer);
        revealRef.current.timer = null;
      }
    };
  }, []);

  const submitLead = async () => {
    if (lead.name.trim().length < 2 || !phoneValid || !lead.consent) return;
    setLead((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await fetch(`${apiUrl}/api/v1/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId,
          sessionId,
          name: lead.name.trim(),
          phone: lead.phone.trim(),
          consentGiven: true,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${String(res.status)}`);
      setLead((s) => ({ ...s, submitted: true, loading: false, visible: false, error: null }));
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Dziękuję! Twoje dane zostały zapisane. Odezwiemy się wkrótce!' },
      ]);
    } catch {
      setLead((s) => ({ ...s, loading: false, error: 'Nie udało się zapisać. Spróbuj ponownie.' }));
    }
  };

  if (!isOpen) return null;

  const windowStyle = isMobile
    ? {
        position: 'fixed' as const,
        left: '0',
        top: viewport ? `${viewport.offsetTop}px` : '0',
        width: '100%',
        height: viewport ? `${viewport.height}px` : '100%',
        borderRadius: '0',
      }
    : { position: 'fixed' as const, bottom: '92px', right: '24px', width: '360px', height: '540px', borderRadius: '16px' };

  const avatarLetter = botName.trim()[0]?.toUpperCase() ?? 'B';
  const isAvatarUrl = avatarEmoji?.startsWith('http');
  const avatarImgStyle = { width: '100%', height: '100%', objectFit: 'cover' as const, borderRadius: '50%', display: 'block' };
  function AvatarContent() {
    return isAvatarUrl
      ? <img src={avatarEmoji} alt="" style={avatarImgStyle} />
      : <>{avatarLetter}</>;
  }

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
        animation: isClosing
          ? 'botiko-fadeout 0.22s ease forwards'
          : 'botiko-fadein 0.25s cubic-bezier(0.34,1.2,0.64,1)',
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
          overflow: 'hidden',
        }}>
          <AvatarContent />
        </div>

        {/* Name + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '14px', lineHeight: 1.2 }}>{botName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: online ? '#4ade80' : '#ef4444',
              flexShrink: 0,
              animation: online ? 'botiko-pulse 2s ease infinite' : 'none',
            }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
              {online ? 'Online · odpowiada błyskawicznie' : 'Niedostępny'}
            </span>
          </div>
        </div>

        {/* Suggested questions toggle — mały przycisk obok X, widoczny po 1. wiadomości */}
        {suggestedQuestions.length > 0 && userMessageCount > 0 && !isLoading && (
          <button
            onClick={() => {
              setShowSuggestions((s) => {
                if (!s) setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 30);
                return !s;
              });
            }}
            title="Przykładowe pytania"
            aria-label="Przykładowe pytania"
            style={{
              background: showSuggestions ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
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
              fontSize: '14px',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            ?
          </button>
        )}

        {/* Close button */}
        <button
          onClick={handleClose}
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

      {/* ── Karta offline gdy pakiet nieaktywny ── */}
      {!online && (
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'28px 20px',gap:'10px',textAlign:'center'}}>
          <div style={{fontSize:'14px',fontWeight:600,color:'#0f172a'}}>
            Bot jest chwilowo niedostępny
          </div>
          <div style={{fontSize:'13px',color:'#64748b',lineHeight:'1.5'}}>
            Skontaktuj się bezpośrednio z firmą.
          </div>
          {companyPhone && (
            <a href={'tel:' + companyPhone} style={{display:'inline-block',marginTop:'8px',padding:'8px 20px',borderRadius:'8px',backgroundColor:'#6366f1',color:'#fff',fontSize:'14px',fontWeight:600,textDecoration:'none'}}>
              {companyPhone}
            </a>
          )}
        </div>
      )}

      {/* ── Informacyjny banner gdy salon fizycznie zamknięty ── */}
      {online && salonClosed && offlineMessage && (
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

      {/* ── Messages (tylko gdy online) ── */}
      {online && <div style={{
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
                overflow: 'hidden',
              }}>
                <AvatarContent />
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

        {/* Typing indicator — only while waiting for first token; once streaming
            starts the growing message bubble is itself the "typing" cue */}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              backgroundColor: `var(--botiko-primary, ${primaryColor})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700, color: '#fff', flexShrink: 0,
              overflow: 'hidden',
            }}>
              <AvatarContent />
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

        {/* Quick suggestions — wyrównane do prawej jak wiadomości użytkownika */}
        {showSuggestions && !isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '4px', alignItems: 'flex-end' }}>
            {suggestedQuestions.map((s) => (
              <button
                key={s}
                onClick={() => void sendMessage(s)}
                style={{
                  padding: '7px 13px',
                  borderRadius: '20px',
                  border: `1.5px solid var(--botiko-primary, ${primaryColor})`,
                  backgroundColor: 'transparent',
                  color: `var(--botiko-primary, ${primaryColor})`,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'right',
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
      </div>}

      {/* ── Lead form (inline) — tylko gdy online ── */}
      {online && lead.visible && !lead.submitted && (
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
            maxLength={100}
            onInput={(e) => setLead((s) => ({ ...s, name: (e.target as HTMLInputElement).value }))}
            style={inputStyle}
          />
          <input type="tel" placeholder="Numer telefonu (np. 600 100 200)" value={lead.phone}
            onInput={(e) => setLead((s) => ({ ...s, phone: (e.target as HTMLInputElement).value }))}
            onBlur={(e) => {
              setPhoneTouched(true);
              setLead((s) => ({ ...s, phone: formatPhone((e.target as HTMLInputElement).value) }));
            }}
            style={{
              ...inputStyle,
              marginTop: '6px',
              borderColor:
                phoneTouched && lead.phone.trim() && !phoneValid
                  ? '#dc2626'
                  : phoneValid && lead.phone.trim()
                    ? '#16a34a'
                    : '#e2e8f0',
            }}
          />
          {phoneTouched && lead.phone.trim() && !phoneValid && (
            <div style={{ marginTop: '4px', fontSize: '11px', color: '#dc2626' }}>
              Podaj poprawny numer telefonu — co najmniej 9 cyfr.
            </div>
          )}
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
              disabled={lead.loading || lead.name.trim().length < 2 || !phoneValid || !lead.consent}
              style={{
                ...btnStyle(primaryColor), flex: 1,
                opacity: (lead.loading || lead.name.trim().length < 2 || !phoneValid || !lead.consent) ? 0.6 : 1,
              }}
            >
              {lead.loading ? '...' : 'Wyślij'}
            </button>
            <button
              onClick={() => setLead((s) => ({ ...s, visible: false, error: null }))}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: '13px', cursor: 'pointer', color: '#64748b' }}
            >
              Anuluj
            </button>
          </div>
          {lead.error && (
            <div style={{ marginTop: '6px', fontSize: '12px', color: '#dc2626' }}>
              {lead.error}
            </div>
          )}
        </div>
      )}

      {/* ── Input area — tylko gdy online ── */}
      {online && <div style={{
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
        <textarea
          ref={inputRef}
          value={input}
          onInput={(e) => {
            const el = e.target as HTMLTextAreaElement;
            setInput(el.value);
            // Auto-grow up to 3 lines (~96px)
            el.style.height = 'auto';
            el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void sendMessage();
            }
          }}
          placeholder="Napisz wiadomość..."
          maxLength={1000}
          rows={1}
          style={{
            ...inputStyle,
            flex: 1,
            resize: 'none',
            overflowY: 'hidden',
            lineHeight: '1.4',
            maxHeight: '96px',
          }}
        />
        <button
          onClick={() => void sendMessage()}
          disabled={isLoading || !input.trim()}
          style={{
            ...btnStyle(primaryColor),
            opacity: isLoading || !input.trim() ? 0.6 : 1,
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
      </div>}

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
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes botiko-fadeout {
          from { opacity: 1; transform: translateY(0)   scale(1); }
          to   { opacity: 0; transform: translateY(10px) scale(0.97); }
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
