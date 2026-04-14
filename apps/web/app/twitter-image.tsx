import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 76,
          background:
            'linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338CA 65%, #6366F1 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 900,
              color: 'white',
            }}
          >
            B
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: 'white', letterSpacing: -1 }}>
              Botiko
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'rgba(165,180,252,0.95)' }}>
              .pl
            </div>
          </div>
        </div>

        <div style={{ fontSize: 50, fontWeight: 900, color: 'white', letterSpacing: -1 }}>
          Bot obsługi klienta 24/7
        </div>
        <div style={{ marginTop: 16, fontSize: 24, color: 'rgba(224,231,255,0.92)' }}>
          Leady • Baza wiedzy • Rezerwacje (link)
        </div>
      </div>
    ),
    size,
  );
}

