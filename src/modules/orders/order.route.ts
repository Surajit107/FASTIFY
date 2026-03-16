import type { FastifyInstance } from 'fastify';
import { createOrderRepository } from './order.repository.js';
import { createOrderService } from './order.service.js';
import { createOrderController } from './order.controller.js';
import { authHook } from '../../hooks/auth.hook.js';

export async function registerOrderRoutes(fastify: FastifyInstance): Promise<void> {
  const repository = createOrderRepository(fastify.mongo);
  const service = createOrderService(repository);
  const controller = createOrderController(service);

  fastify.post('/orders', {
    preHandler: [authHook],
    handler: controller.create.bind(controller),
  });

  fastify.get<{ Params: { id: string } }>('/orders/:id', {
    preHandler: [authHook],
    handler: controller.getById.bind(controller),
  });

  fastify.get('/orders', {
    preHandler: [authHook],
    handler: controller.list.bind(controller),
  });
}
