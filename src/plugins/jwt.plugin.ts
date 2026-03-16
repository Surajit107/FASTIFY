import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

async function jwtPlugin(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
): Promise<void> {
  await fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET,
    sign: {
      expiresIn: fastify.config.JWT_EXPIRES_IN,
    },
  });
}

export default fp(jwtPlugin, { name: 'jwt-plugin' });
