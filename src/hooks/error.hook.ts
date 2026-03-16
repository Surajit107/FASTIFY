import type { FastifyInstance } from 'fastify';
import { createErrorHandler } from '../errors/error.handler.js';

export function registerErrorHook(fastify: FastifyInstance): void {
  const handler = createErrorHandler(fastify.log);
  fastify.setErrorHandler(handler);
}
