import type { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../errors/app.error.js';

export async function authHook(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
    const sub = request.user?.sub;
    if (sub) {
      request.userId = sub;
    }
  } catch {
    throw new UnauthorizedError('Invalid or missing token');
  }
}

/**
 * Optional auth: sets request.userId if valid token present, does not reject.
 */
export async function optionalAuthHook(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
    const sub = request.user?.sub;
    if (sub) {
      request.userId = sub;
    }
  } catch {
    // No token or invalid — leave request.userId undefined
  }
}
