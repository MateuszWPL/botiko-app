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
}

function generateSessionId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function ChatWindow({
  botId,
  botName,
  primaryColor,
  welcomeMessage,
  isOpen,
  apiUrl,
}: ChatWindowProps) {
  // Initialized once per component instance — isolated per widget mount
  const [sessionId] = useState<string>(generateSessionId);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: welcomeMessage },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lead, setLead] = useState<LeadFormState>({
    visible: false,
    name: '',
    phone: '',
    consent: false,
    submitted: false,
    loading: false,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId, sessionId, message: text }),
      });
      const data = (await res.json()) as { message?: string };
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message ?? 'Przepraszam, coś poszło nie tak.',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Przepraszam, wystąpił błąd połączenia. Spróbuj ponownie.',
        },
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
      setLead((s) => ({ ...s, submitted: true, loading: false }));
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Dziękuję! Twoje dane zostały zapisane. Odezwiemy się wkrótce! 😊',
        },
      ]);
    } catch {
      setLead((s) => ({ ...s, loading: false }));
    }
  };

  if (!isOpen) return null;

  const windowStyle = isMobile
    ? {
        position: 'fixed' as const,
        inset: '0',
        width: '100%',
        height: '100%',
        borderRadius: '0',
      }
    : {
        position: 'fixed' as const,
        bottom: '92px',
        right: '24px',
        width: '360px',
        height: '520px',
        borderRadius: '16px',
      };

  return (
    <div
      style={{
        ...windowStyle,
        backgroundColor: '#fff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2147483646,
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        animation: 'botiko-fadein 0.2s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: primaryColor,
          color: '#fff',
          padding: '14px 16px',
          fontWeight: 600,
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4ade80',
            flexShrink: 0,
          }}
        />
        {botName}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '82%',
                padding: '9px 13px',
                borderRadius:
                  msg.role === 'user'
                    ? '14px 14px 4px 14px'
                    : '14px 14px 14px 4px',
                backgroundColor:
                  msg.role === 'user' ? primaryColor : '#f1f5f9',
                color: msg.role === 'user' ? '#fff' : '#0f172a',
                fontSize: '14px',
                lineHeight: '1.5',
                wordBreak: 'break-word',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '14px 14px 14px 4px',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#94a3b8',
                    animation: `botiko-bounce 1.2s ease infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Lead form (inline) */}
      {lead.visible && !lead.submitted && (
        <div
          style={{
            padding: '12px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '8px',
            }}
          >
            Zostaw swój kontakt
          </div>
          <input
            type="text"
            placeholder="Imię i nazwisko"
            value={lead.name}
            onInput={(e) =>
              setLead((s) => ({
                ...s,
                name: (e.target as HTMLInputElement).value,
              }))
            }
            style={inputStyle}
          />
          <input
            type="tel"
            placeholder="Numer telefonu"
            value={lead.phone}
            onInput={(e) =>
              setLead((s) => ({
                ...s,
                phone: (e.target as HTMLInputElement).value,
              }))
            }
            style={{ ...inputStyle, marginTop: '6px' }}
          />
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px',
              marginTop: '8px',
              fontSize: '11px',
              color: '#64748b',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={lead.consent}
              onChange={(e) =>
                setLead((s) => ({
                  ...s,
                  consent: (e.target as HTMLInputElement).checked,
                }))
              }
              style={{ marginTop: '2px', flexShrink: 0 }}
            />
            Wyrażam zgodę na przetwarzanie moich danych osobowych w celu odpowiedzi na zapytanie (RODO)
          </label>
          <div
            style={{ display: 'flex', gap: '6px', marginTop: '8px' }}
          >
            <button
              onClick={() => void submitLead()}
              disabled={
                lead.loading ||
                !lead.name.trim() ||
                !lead.phone.trim() ||
                !lead.consent
              }
              style={{
                ...btnStyle(primaryColor),
                flex: 1,
                opacity:
                  lead.loading ||
                  !lead.name.trim() ||
                  !lead.phone.trim() ||
                  !lead.consent
                    ? 0.6
                    : 1,
              }}
            >
              {lead.loading ? '...' : 'Wyślij'}
            </button>
            <button
              onClick={() => setLead((s) => ({ ...s, visible: false }))}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#fff',
                fontSize: '13px',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div
        style={{
          padding: '10px 12px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '6px',
          alignItems: 'flex-end',
          flexShrink: 0,
        }}
      >
        {!lead.visible && !lead.submitted && (
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
          type="text"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void sendMessage();
            }
          }}
          placeholder="Napisz wiadomość..."
          maxLength={1000}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          onClick={() => void sendMessage()}
          disabled={isLoading || !input.trim()}
          style={{
            ...btnStyle(primaryColor),
            opacity: isLoading || !input.trim() ? 0.6 : 1,
            flexShrink: 0,
          }}
        >
          ↑
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          padding: '5px',
          fontSize: '11px',
          color: '#cbd5e1',
          flexShrink: 0,
        }}
      >
        Powered by{' '}
        <a
          href="https://botiko.pl"
          target="_blank"
          rel="noopener noreferrer"
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
    backgroundColor: color,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
  };
}
