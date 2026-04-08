export function App() {
  return (
    <main
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: 24,
        lineHeight: 1.5,
      }}
    >
      <h1 style={{ margin: 0 }}>Botiko Widget (dev preview)</h1>
      <p style={{ marginTop: 12, color: '#475569' }}>
        Ten ekran służy tylko do lokalnego podglądu. Prawdziwy widget buduje się
        jako <code>dist/embed.js</code> (IIFE) i jest osadzany na stronach klientów.
      </p>

      <p style={{ marginTop: 12 }}>
        Żeby przetestować embed lokalnie, dodaj na dowolnej stronie:
      </p>

      <pre
        style={{
          padding: 12,
          background: '#0b1220',
          color: '#e2e8f0',
          borderRadius: 10,
          overflowX: 'auto',
        }}
      >
        {`<script src=\"http://localhost:5173/embed.js\" data-bot-id=\"demo\"></script>`}
      </pre>
    </main>
  );
}
