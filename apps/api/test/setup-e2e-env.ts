import { config } from 'dotenv';
import { resolve } from 'node:path';

// Load apps/api/.env before any module imports env.ts (Jest sets NODE_ENV=test).
config({ path: resolve(__dirname, '../.env') });
