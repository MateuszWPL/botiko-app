/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Avoid re-exporting entire packages — only import what's used
    optimizePackageImports: ['@supabase/supabase-js', '@supabase/ssr'],
  },
};

export default nextConfig;
