/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';
import { gzipSync } from 'zlib';
import { readFileSync } from 'fs';
import type { Plugin } from 'vite';

// Bumped 12 → 13 → 14 → 15KB. 15KB adds Markdown-aware links + rich map/booking
// cards in bot answers (Google Maps / Booksy). Trade-off accepted: clear UX win.
const MAX_GZIP_KB = 15;

function bundleSizeCheck(): Plugin {
  return {
    name: 'bundle-size-check',
    closeBundle() {
      try {
        const content = readFileSync('dist/embed.js');
        const gzipped = gzipSync(content);
        const sizeKb = gzipped.length / 1024;
        if (sizeKb > MAX_GZIP_KB) {
          console.error(
            `\n❌ Bundle too large: ${sizeKb.toFixed(1)}KB gzip (max ${MAX_GZIP_KB}KB)\n`,
          );
          process.exit(1);
        } else {
          console.log(
            `\n✅ Bundle size OK: ${sizeKb.toFixed(1)}KB gzip (max ${MAX_GZIP_KB}KB)\n`,
          );
        }
      } catch {
        // Skip check if file not yet written
      }
    },
  };
}

export default defineConfig({
  plugins: [preact(), bundleSizeCheck()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    globals: false,
  },
  server: {
    cors: true,
  },
  // preview serves dist/, used locally instead of `pnpm dev` to get embed.js at /embed.js
  preview: {
    port: 5173,
    strictPort: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/embed.ts'),
      name: 'Botiko',
      formats: ['iife'],
      fileName: () => 'embed.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    target: 'es2017',
    minify: 'esbuild',
    reportCompressedSize: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'production',
    ),
  },
});
