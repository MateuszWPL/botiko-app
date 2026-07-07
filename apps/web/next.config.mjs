/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const WIDGET_URL = process.env.NEXT_PUBLIC_WIDGET_URL ?? 'https://widget.botiko.pl';
// Widget may call the production API regardless of API_URL (its own VITE_API_URL default)
const PROD_API_URL = 'https://api.botiko.pl';

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Block iframe embedding (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Disable browser XSS auditor (outdated but harmless)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Don't send referrer to other origins
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restrict browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  // CSP — tightened for dashboard SaaS (no inline scripts except Next.js needs)
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js runtime + Recharts inline SVGs require unsafe-inline for styles
      "style-src 'self' 'unsafe-inline'",
      // Next.js requires unsafe-inline for hydration scripts; nonce approach not used yet
      // WIDGET_URL: allow loading the embedded widget script from demo bot
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${WIDGET_URL}`,
      // Images: self + data URIs (for inline SVGs/avatars)
      "img-src 'self' data: blob: https://res.cloudinary.com",
      // Fonts: self
      "font-src 'self'",
      // API calls (configured at build time)
      `connect-src 'self' ${API_URL} ${PROD_API_URL} https://*.supabase.co wss://*.supabase.co https://api.cloudinary.com https://*.ingest.sentry.io https://*.ingest.de.sentry.io https://*.ingest.us.sentry.io`,
      // Frames: Stripe billing portal + YouTube/Vimeo for blog video embeds
      "frame-src 'self' https://billing.stripe.com https://checkout.stripe.com https://www.youtube.com https://player.vimeo.com",
      // Strict object/media
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  experimental: {
    // Avoid re-exporting entire packages — only import what's used
    optimizePackageImports: ['@supabase/supabase-js', '@supabase/ssr'],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.botiko.pl' }],
        destination: 'https://botiko.pl/:path*',
        permanent: true,
      },
      {
        source: '/opengraph-image',
        destination: '/opengraph-image.png',
        permanent: true,
      },
      {
        source: '/blog/kategoria/narzedzzia',
        destination: '/blog/kategoria/narzedzia',
        permanent: true,
      },
      // Konsolidacja kanibalizacji bloga (audyt SEO Faza 1A) — unikalna treść
      // przeniesiona do survivorów, stare URL-e 301 na docelowe.
      {
        source: '/blog/rodo-chatbot',
        destination: '/blog/chatbot-a-rodo-dane-klientow',
        permanent: true,
      },
      {
        source: '/blog/chatbot-recepcja',
        destination: '/blog/czy-bot-ai-zastapi-recepcjonistke',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

// Sentry wrapper — no-op when SENTRY_DSN is unset (DSN gating happens inside the
// sentry.*.config.ts init blocks). Wrapping is safe to always apply.
import { withSentryConfig } from '@sentry/nextjs';

export default withSentryConfig(nextConfig, {
  // Suppress build-time logs when no DSN is configured (e.g. CI without secrets).
  silent: !process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Source-map upload only runs when SENTRY_AUTH_TOKEN is present.
  widenClientFileUpload: true,
});

