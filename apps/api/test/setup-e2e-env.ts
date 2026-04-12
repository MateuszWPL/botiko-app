import { config } from 'dotenv';
import { resolve } from 'node:path';

// Load apps/api/.env before any module imports env.ts (Jest sets NODE_ENV=test).
config({ path: resolve(__dirname, '../.env') });

// Windows + Supabase pooler: disable strict TLS cert verification outside production.
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
