import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import { Redis } from 'ioredis';

/**
 * Optional Redis plugin. Registers only when REDIS_URI is set.
 * Decorates `fastify.redis` as null when unset so callers can null-check.
 */
async function redisPlugin(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
): Promise<void> {
  const uri = fastify.config.REDIS_URI;
  if (!uri) {
    fastify.decorate('redis', null);
    fastify.log.warn('REDIS_URI not set; Redis disabled');
    return;
  }

  const redis = new Redis(uri, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => (times > 3 ? null : Math.min(times * 100, 3000)),
  });

  redis.on('error', (err: Error) => fastify.log.error({ err }, 'Redis error'));
  redis.on('connect', () => fastify.log.debug('Redis connected'));

  fastify.decorate('redis', redis);

  fastify.addHook('onClose', async (instance) => {
    if (instance.redis) {
      await instance.redis.quit();
    }
  });
}

export default fp(redisPlugin, { name: 'redis-plugin' });
