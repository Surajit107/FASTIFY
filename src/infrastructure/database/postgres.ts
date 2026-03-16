import type { Env } from '../../config/env.js';
import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

/**
 * Optional Postgres pool. Returns null when POSTGRES_URI is unset.
 * Wire repositories to this only after you choose Postgres for a domain.
 */
export function getPgPool(env: Env): pg.Pool | null {
  if (!env.POSTGRES_URI) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: env.POSTGRES_URI,
      max: 20,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  return pool;
}

export async function closePgPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
