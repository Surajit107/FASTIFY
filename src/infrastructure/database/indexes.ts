import type { Db } from 'mongodb';

/**
 * Ensure collection indexes used by template queries.
 * Safe to call on every startup (createIndex is idempotent).
 */
export async function ensureIndexes(db: Db): Promise<void> {
  await Promise.all([
    db.collection('users').createIndex({ email: 1 }, { unique: true, name: 'users_email_unique' }),
    db.collection('orders').createIndex({ userId: 1, createdAt: -1 }, { name: 'orders_userId_createdAt' }),
  ]);
}
