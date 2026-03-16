import type { FastifyRequest, FastifyReply } from 'fastify';
import type { OrderService } from './order.service.js';
import type { CreateOrderBody, OrderIdParam } from './order.schema.js';
import { parseBody, parseParams } from '../../utils/validator.js';
import { createOrderSchema, orderIdParamSchema } from './order.schema.js';
import { sendCreated } from '../../decorators/reply.js';
import { requireUserId } from '../../decorators/request.js';
import { ForbiddenError } from '../../errors/app.error.js';

function toResponse(order: {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; unitPriceCents: number }[];
  totalCents: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: order.id,
    userId: order.userId,
    items: order.items,
    totalCents: order.totalCents,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

export function createOrderController(service: OrderService) {
  return {
    async create(
      request: FastifyRequest<{ Body: unknown }>,
      reply: FastifyReply
    ): Promise<FastifyReply> {
      const userId = requireUserId(request);
      const body = parseBody<CreateOrderBody>(createOrderSchema, request.body);
      const order = await service.create(userId, body.items);
      return sendCreated(reply, toResponse(order), `/orders/${order.id}`);
    },

    async getById(
      request: FastifyRequest<{ Params: unknown }>,
      reply: FastifyReply
    ): Promise<FastifyReply> {
      const userId = requireUserId(request);
      const { id } = parseParams<OrderIdParam>(orderIdParamSchema, request.params);
      const order = await service.getById(id);
      if (order.userId !== userId) {
        throw new ForbiddenError('Order not found');
      }
      return reply.send(toResponse(order));
    },

    async list(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
      const userId = requireUserId(request);
      const orders = await service.getByUserId(userId);
      return reply.send({ orders: orders.map(toResponse) });
    },
  };
}
