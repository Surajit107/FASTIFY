import type { Redis } from 'ioredis';

const DEFAULT_TTL_SEC = 3600;

/**
 * Thin Redis cache helpers. Pass `fastify.redis` after registering the Redis plugin.
 */
export async function cacheGet<T>(redis: Redis | null | undefined, key: string): Promise<T | null> {
  if (!redis) return null;
  const raw = await redis.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(
  redis: Redis | null | undefined,
  key: string,
  value: unknown,
  ttlSec = DEFAULT_TTL_SEC
): Promise<void> {
  if (!redis) return;
  await redis.setex(key, ttlSec, JSON.stringify(value));
}

export async function cacheDel(redis: Redis | null | undefined, key: string): Promise<void> {
  if (!redis) return;
  await redis.del(key);
}

export function cacheKey(prefix: string, ...parts: Array<string | number>): string {
  return [prefix, ...parts].join(':');
}
