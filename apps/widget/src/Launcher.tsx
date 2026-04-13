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
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    if (isOpen || bubbleDismissed) return;
    const t = setTimeout(() => setBubbleVisible(true), 5000);
    return () => clearTimeout(t);
  }, [isOpen, bubbleDismissed]);

  useEffect(() => {
    if (isOpen) setBubbleVisible(false);
  }, [isOpen]);

  if (isMobile && isOpen) return null;

  const bubbleText = welcomeMsg.length > 60 ? welcomeMsg.slice(0, 58) + '\u2026' : welcomeMsg;

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
      {/* Proactive bubble */}
      {bubbleVisible && !isOpen && (
        <div
          onClick={() => { setBubbleVisible(false); onClick(); }}
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px 12px 4px 12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            padding: '10px 14px',
            maxWidth: '220px',
            fontSize: '13px',
            lineHeight: '1.45',
            color: '#0f172a',
            cursor: 'pointer',
            position: 'relative',
            animation: 'botiko-fadein 0.3s ease',
          }}
        >
          {bubbleText}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBubbleVisible(false);
              setBubbleDismissed(true);
            }}
            aria-label="Zamknij"
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#94a3b8',
              color: '#fff',
              fontSize: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              lineHeight: 1,
            }}
          >
            &#x2715;
          </button>
        </div>
      )}

      {/* FAB button */}
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
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
        }}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
