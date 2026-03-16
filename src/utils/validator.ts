import type { z } from 'zod';
import { ValidationError } from '../errors/app.error.js';

export function validateOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  const details = result.error.flatten();
  throw new ValidationError('Validation failed', details);
}

export function parseQuery<T>(schema: z.ZodType<T>, query: unknown): T {
  return validateOrThrow(schema, query);
}

export function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  return validateOrThrow(schema, body);
}

export function parseParams<T>(schema: z.ZodType<T>, params: unknown): T {
  return validateOrThrow(schema, params);
}
