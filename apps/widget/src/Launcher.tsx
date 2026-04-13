import { useState, useEffect } from 'preact/hooks';

interface LauncherProps {
  primaryColor: string;
  isOpen: boolean;
  welcomeMsg: string;
  onClick: () => void;
}

export function Launcher({ primaryColor, isOpen, onClick, welcomeMsg }: LauncherProps) {
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const isMobile =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  // Show bubble once after 5s — only if chat never opened
  useEffect(() => {
    if (bubbleDismissed || isOpen) return;
    const t = setTimeout(() => setBubbleVisible(true), 5000);
    return () => clearTimeout(t);
  }, [bubbleDismissed, isOpen]);

  // Permanently dismiss bubble the moment chat opens (any trigger — FAB or bubble click)
  useEffect(() => {
    if (isOpen) {
      setBubbleVisible(false);
      setBubbleDismissed(true);
    }
  }, [isOpen]);

  // On mobile with chat open: hide entire launcher
  if (isMobile && isOpen) return null;

  const bubbleText =
    welcomeMsg.length > 60 ? welcomeMsg.slice(0, 58) + '\u2026' : welcomeMsg;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2147483647,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
      }}
    >
      {/* ── Proactive bubble ──────────────────────────────────────────────────── */}
      {bubbleVisible && !isOpen && (
        /*
         * STRUCTURE: outer wrapper (position: relative) contains:
         *   1. The clickable text div
         *   2. The dismiss button — SIBLING, not child of 1
         *
         * This means clicking X never bubbles into the text div's onClick.
         * No stopPropagation needed → no shadow-DOM / Preact event issues.
         */
        <div style={{ position: 'relative' }}>
          {/* Clickable text area */}
          <div
            onClick={onClick}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px 12px 4px 12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              padding: '11px 15px',
              maxWidth: '230px',
              fontSize: '13px',
              lineHeight: '1.5',
              color: '#0f172a',
              cursor: 'pointer',
              userSelect: 'none',
              animation: 'botiko-fadein 0.3s ease',
            }}
          >
            {bubbleText}
          </div>

          {/* Dismiss button — sibling of text div, positioned in top-right corner */}
          <div
            onClick={() => {
              setBubbleVisible(false);
              setBubbleDismissed(true);
            }}
            role="button"
            aria-label="Zamknij"
            style={{
              position: 'absolute',
              top: '-9px',
              right: '-9px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#64748b',
              color: '#fff',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              zIndex: 1,
            }}
          >
            &#x2715;
          </div>
        </div>
      )}

      {/* ── FAB button ────────────────────────────────────────────────────────── */}
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 6px 16px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 4px 12px rgba(0,0,0,0.25)';
        }}
      >
        {/* Chat icon — fades out when open */}
        <span
          style={{
            position: 'absolute',
            display: 'flex',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
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
            transition: 'opacity 0.2s ease, transform 0.2s ease',
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
  );
}
