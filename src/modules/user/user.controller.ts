import type { FastifyRequest, FastifyReply } from 'fastify';
import type { UserService } from './user.service.js';
import type { CreateUserBody, UpdateUserBody, UserIdParam } from './user.schema.js';
import { parseBody, parseParams } from '../../utils/validator.js';
import { createUserSchema, updateUserSchema, userIdParamSchema } from './user.schema.js';
import { sendCreated } from '../../decorators/reply.js';
import { requireUserId } from '../../decorators/request.js';
import type { UserResponse } from './user.types.js';

function toResponse(user: { id: string; email: string; name: string; createdAt: Date; updatedAt: Date }): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function createUserController(service: UserService) {
  return {
    async create(
      request: FastifyRequest<{ Body: unknown }>,
      reply: FastifyReply
    ): Promise<FastifyReply> {
      const body = parseBody<CreateUserBody>(createUserSchema, request.body);
      const user = await service.create(body);
      return sendCreated(reply, toResponse(user), `/users/${user.id}`);
    },

    async getMe(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
      const userId = requireUserId(request);
      const user = await service.getById(userId);
      return reply.send(toResponse(user));
    },

    async getById(
      request: FastifyRequest<{ Params: unknown }>,
      reply: FastifyReply
    ): Promise<FastifyReply> {
      const { id } = parseParams<UserIdParam>(userIdParamSchema, request.params);
      const user = await service.getById(id);
      return reply.send(toResponse(user));
    },

    async update(
      request: FastifyRequest<{ Params: unknown; Body: unknown }>,
      reply: FastifyReply
    ): Promise<FastifyReply> {
      const userId = requireUserId(request);
      const body = parseBody<UpdateUserBody>(updateUserSchema, request.body);
      const user = await service.update(userId, body);
      return reply.send(toResponse(user));
    },
  };
}
