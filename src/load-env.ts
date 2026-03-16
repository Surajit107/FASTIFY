/**
 * Load .env before any other imports that depend on process.env.
 * In ESM, imports are hoisted and run before script body, so dotenv must run
 * in a dedicated module imported first.
 */
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });
