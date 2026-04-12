/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Images: self + data URIs (for inline SVGs/avatars)
      "img-src 'self' data: blob:",
      // Fonts: self
      "font-src 'self'",
      // API calls (configured at build time)
      `connect-src 'self' ${API_URL} https://*.supabase.co wss://*.supabase.co`,
      // Frames: Stripe billing portal
      "frame-src 'self' https://billing.stripe.com https://checkout.stripe.com",
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

export default nextConfig;
