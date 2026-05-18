export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

// Next.js 14 nie posiada hooka onRequestError (został dodany w Next 15+),
// więc nie reeksportujemy go z @sentry/nextjs. Errors w server components są
// łapane przez global-error.tsx + Sentry init w sentry.server.config.ts.
