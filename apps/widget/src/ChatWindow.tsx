import { useState } from 'preact/hooks';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  botId: string;
  primaryColor: string;
  welcomeMessage: string;
  isOpen: boolean;
}

export function ChatWindow({
  botId,
  primaryColor,
  welcomeMessage,
  isOpen,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: welcomeMessage },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const apiUrl =
        (window as unknown as Record<string, string>).__BOTIKO_API_URL__ ||
        'https://api.botiko.pl';
      const res = await fetch(`${apiUrl}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId, message: text }),
      });
      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Przepraszam, wystąpił błąd. Spróbuj ponownie.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '92px',
        right: '24px',
        width: '360px',
        height: '520px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2147483646,
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: primaryColor,
          color: '#fff',
          padding: '16px',
          fontWeight: 600,
          fontSize: '15px',
        }}
      >
        Asystentka
      </div>

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
              justifyContent:
                msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '8px 12px',
                borderRadius:
                  msg.role === 'user'
                    ? '12px 12px 2px 12px'
                    : '12px 12px 12px 2px',
                backgroundColor:
                  msg.role === 'user' ? primaryColor : '#f1f5f9',
                color: msg.role === 'user' ? '#fff' : '#0f172a',
                fontSize: '14px',
                lineHeight: '1.4',
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
                padding: '8px 12px',
                borderRadius: '12px 12px 12px 2px',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                fontSize: '14px',
              }}
            >
              ...
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          padding: '12px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          type="text"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Napisz wiadomość..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            backgroundColor: primaryColor,
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            opacity: isLoading || !input.trim() ? 0.6 : 1,
          }}
        >
          Wyślij
        </button>
      </div>

      <div
        style={{
          textAlign: 'center',
          padding: '6px',
          fontSize: '11px',
          color: '#94a3b8',
        }}
      >
        Powered by{' '}
        <a
          href="https://botiko.pl"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: primaryColor, textDecoration: 'none' }}
        >
          Botiko.pl
        </a>
      </div>
    </div>
  );
}
