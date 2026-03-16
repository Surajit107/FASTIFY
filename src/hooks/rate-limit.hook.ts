import type { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';

export async function registerRateLimitHook(fastify: FastifyInstance): Promise<void> {
  await fastify.register(rateLimit, {
    max: fastify.config.RATE_LIMIT_MAX,
    timeWindow: fastify.config.RATE_LIMIT_TIME_WINDOW_MS,
    keyGenerator: (request) => {
      const forwarded = request.headers['x-forwarded-for'];
      const ip = typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() : request.ip;
      return ip ?? 'unknown';
    },
  });
}
