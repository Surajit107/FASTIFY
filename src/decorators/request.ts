import type { FastifyRequest } from 'fastify';

/**
 * Safe get of request userId (set by auth hook).
 */
export function getUserId(request: FastifyRequest): string | undefined {
  return request.userId;
}

/**
 * Assert request has authenticated user; throws if not.
 */
export function requireUserId(request: FastifyRequest): string {
  const id = request.userId;
  if (!id) {
    throw new Error('requireUserId: no userId on request');
  }
  return id;
}
