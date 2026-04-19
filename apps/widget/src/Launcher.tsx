import { useState, useEffect } from 'preact/hooks';

interface LauncherProps {
  primaryColor: string;
  isOpen: boolean;
  welcomeMsg: string;
  onClick: () => void;
}

const BUBBLE_SHOW_DELAY = 3000;   // pojawia się po 3s
const BUBBLE_VISIBLE_MS  = 7000;  // widoczna przez 7s (łącznie ~10s od załadowania)
const BUBBLE_FADEOUT_MS  = 400;   // czas animacji fade-out

export function Launcher({ primaryColor, isOpen, onClick, welcomeMsg }: LauncherProps) {
  const [bubbleState, setBubbleState] = useState<'hidden' | 'visible' | 'fading'>('hidden');
  const [showBadge, setShowBadge] = useState(false);
  // Reaktywne wykrywanie mobile — reaguje na resize/rotate urządzenia
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

  // Pojawiaj bańkę + badge po 3s — tylko raz przy montowaniu
  useEffect(() => {
    if (isOpen) return;
    const t = setTimeout(() => {
      setBubbleState('visible');
      setShowBadge(true);
    }, BUBBLE_SHOW_DELAY);
    return () => clearTimeout(t);
  }, []); // tylko raz przy montowaniu

  // Auto fade-out po 7s widoczności
  useEffect(() => {
    if (bubbleState !== 'visible') return;
    const t = setTimeout(() => setBubbleState('fading'), BUBBLE_VISIBLE_MS);
    return () => clearTimeout(t);
  }, [bubbleState]);

  // Po zakończeniu fade-out — ukryj całkowicie
  useEffect(() => {
    if (bubbleState !== 'fading') return;
    const t = setTimeout(() => setBubbleState('hidden'), BUBBLE_FADEOUT_MS);
    return () => clearTimeout(t);
  }, [bubbleState]);

  // Ukryj bańkę i badge natychmiast gdy czat się otwiera
  useEffect(() => {
    if (isOpen) {
      setBubbleState('hidden');
      setShowBadge(false);
    }
  }, [isOpen]);

  // Na mobile z otwartym chatem: ukryj cały launcher
  if (isMobile && isOpen) return null;

  const bubbleText =
    welcomeMsg.length > 55 ? welcomeMsg.slice(0, 53) + '\u2026' : welcomeMsg;

  const showBubble = bubbleState !== 'hidden' && !isOpen;

  // Na mobile z otwartym chatem: ukryj cały launcher — display:none zamiast return null
  // żeby uniknąć błędów przy ponownym montowaniu komponentu
  return (
    <div
      style={{
        display: isMobile && isOpen ? 'none' : 'flex',
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2147483647,
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
      }}
    >
      {/* ── Proactive bubble ──────────────────────────────────────────────────── */}
      {showBubble && (
        <div
          onClick={onClick}
          role="button"
          aria-label="Otwórz czat"
          style={{
            backgroundColor: '#fff',
            borderRadius: '18px 18px 4px 18px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.11), 0 1px 3px rgba(0,0,0,0.06)',
            padding: '11px 15px',
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: '1.45',
            color: '#1e293b',
            cursor: 'pointer',
            userSelect: 'none',
            border: '1px solid rgba(99,102,241,0.1)',
            maxWidth: '200px',
            whiteSpace: 'normal',
            // fade-in lub fade-out zależnie od stanu
            animation: bubbleState === 'visible'
              ? 'botiko-bubble-in 0.4s cubic-bezier(0.34,1.4,0.64,1) both'
              : 'botiko-bubble-out 0.4s ease forwards',
          }}
        >
          {bubbleText}
        </div>
      )}

      {/* ── FAB button (wrapper for badge positioning) ─────────────────────── */}
      <div style={{ position: 'relative' }}>
        {/* Notification badge — pulses 3× via CSS then stays static */}
        {showBadge && !isOpen && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              lineHeight: '20px',
              textAlign: 'center',
              zIndex: 1,
              animation: 'botiko-badge-pulse 0.7s ease 3',
            }}
          >
            1
          </span>
        )}

        <button
          onClick={onClick}
          aria-label={isOpen ? 'Zamknij czat' : 'Otwórz czat'}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: `var(--botiko-primary, ${primaryColor})`,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.28)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.22)';
          }}
        >
          {/* Chat icon — fades out when open */}
          <span
            style={{
              position: 'absolute',
              display: 'flex',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
              opacity: isOpen ? 0 : 1,
              transform: isOpen ? 'rotate(90deg) scale(0.4)' : 'rotate(0deg) scale(1)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          {/* X icon — fades in when open */}
          <span
            style={{
              position: 'absolute',
              display: 'flex',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.4)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5l10 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* Keyframes — scoped to shadow root */}
      <style>{`
        @keyframes botiko-bubble-in {
          from { opacity: 0; transform: translateY(8px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes botiko-bubble-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(6px) scale(0.95); }
        }
        @keyframes botiko-badge-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.35); }
        }
      `}</style>
    </div>
  );
}
