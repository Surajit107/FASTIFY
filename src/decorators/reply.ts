import type { FastifyReply } from 'fastify';

export function sendCreated<T>(reply: FastifyReply, body: T, location?: string): FastifyReply {
  if (location) {
    reply.header('Location', location);
  }
  return reply.status(201).send(body);
}

export function sendNoContent(reply: FastifyReply): FastifyReply {
  return reply.status(204).send();
}
