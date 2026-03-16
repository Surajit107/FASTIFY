import type { FastifyInstance } from 'fastify';
import { createUserRepository } from '../user/user.repository.js';
import { createUserService } from '../user/user.service.js';
import { createAuthService } from './auth.service.js';
import { createAuthController } from './auth.controller.js';
import { parseBody } from '../../utils/validator.js';
import { registerSchema } from './auth.schema.js';
import { sendCreated } from '../../decorators/reply.js';
import type { UserResponse } from '../user/user.types.js';

function toUserResponse(user: { id: string; email: string; name: string; createdAt: Date; updatedAt: Date }): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function registerAuthRoutes(fastify: FastifyInstance): Promise<void> {
  const userRepository = createUserRepository(fastify.mongo);
  const userService = createUserService(userRepository);
  const authService = createAuthService(fastify, userRepository);
  const authController = createAuthController(authService);

  fastify.post('/auth/login', {
    handler: authController.login.bind(authController),
  });

  fastify.post('/auth/register', {
    handler: async (request, reply) => {
      const body = parseBody(registerSchema, request.body);
      const user = await userService.create(body);
      const token = await authService.signToken(user.id);
      return sendCreated(reply, { user: toUserResponse(user), token }, `/users/${user.id}`);
    },
  });
}
