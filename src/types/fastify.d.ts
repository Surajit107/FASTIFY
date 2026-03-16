import type { MongoClient } from 'mongodb';
import type { Redis } from 'ioredis';
import type { Env } from '../config/env.js';

declare module 'fastify' {
  interface FastifyInstance {
    mongo: MongoClient;
    redis: Redis | null;
    config: Env;
  }

  interface FastifyRequest {
    userId?: string;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; email?: string };
    user: { sub: string; email?: string };
  }
}

export {};
