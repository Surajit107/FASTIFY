import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AuthService } from './auth.service.js';
import type { LoginBody } from './auth.schema.js';
import { parseBody } from '../../utils/validator.js';
import { loginSchema } from './auth.schema.js';

export function createAuthController(authService: AuthService) {
  return {
    async login(
      request: FastifyRequest<{ Body: unknown }>,
      reply: FastifyReply
    ): Promise<FastifyReply> {
      const body = parseBody<LoginBody>(loginSchema, request.body);
      const { userId } = await authService.login(body.email, body.password);
      const token = await authService.signToken(userId);
      return reply.send({ token, expiresIn: '7d' });
    },
  };
}
