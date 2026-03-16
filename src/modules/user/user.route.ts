import type { FastifyInstance } from 'fastify';
import { createUserRepository } from './user.repository.js';
import { createUserService } from './user.service.js';
import { createUserController } from './user.controller.js';
import { authHook } from '../../hooks/auth.hook.js';

export async function registerUserRoutes(fastify: FastifyInstance): Promise<void> {
  const repository = createUserRepository(fastify.mongo);
  const service = createUserService(repository);
  const controller = createUserController(service);

  fastify.post('/users', {
    handler: controller.create.bind(controller),
  });

  fastify.get('/users/me', {
    preHandler: [authHook],
    handler: controller.getMe.bind(controller),
  });

  fastify.get<{ Params: { id: string } }>('/users/:id', {
    preHandler: [authHook],
    handler: controller.getById.bind(controller),
  });

  fastify.patch('/users/me', {
    preHandler: [authHook],
    handler: controller.update.bind(controller),
  });
}
