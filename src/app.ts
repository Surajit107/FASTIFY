import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import { env, loggerOptions } from './config/index.js';
import { mongodbPlugin, jwtPlugin, redisPlugin } from './plugins/index.js';
import { registerErrorHook } from './hooks/error.hook.js';
import { registerRateLimitHook } from './hooks/rate-limit.hook.js';
import { registerRequestLogger } from './hooks/request-logger.hook.js';
import { registerUserRoutes } from './modules/user/index.js';
import { registerAuthRoutes } from './modules/auth/index.js';
import { registerOrderRoutes } from './modules/orders/index.js';

function resolveCorsOrigin(): boolean | string | string[] {
  if (env.CORS_ORIGIN === '*') {
    return env.NODE_ENV === 'production' ? false : true;
  }
  const origins = env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
  return origins.length === 1 ? origins[0]! : origins;
}

export async function buildApp() {
  const app = Fastify({
    logger: {
      ...loggerOptions,
      level: env.LOG_LEVEL ?? (loggerOptions.level as string) ?? 'info',
    },
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'reqId',
  });

  app.decorate('config', env);

  await app.register(cors, {
    origin: resolveCorsOrigin(),
    credentials: true,
  });
  await app.register(helmet, { global: true });
  await app.register(sensible);

  await app.register(mongodbPlugin);
  await app.register(jwtPlugin);
  await app.register(redisPlugin);

  registerErrorHook(app);
  registerRequestLogger(app);
  await registerRateLimitHook(app);

  await app.register(registerAuthRoutes, { prefix: '/api' });
  await app.register(registerUserRoutes, { prefix: '/api' });
  await app.register(registerOrderRoutes, { prefix: '/api' });

  app.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return app;
}
