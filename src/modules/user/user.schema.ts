import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(256),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(256).optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().length(24).regex(/^[a-f0-9]+$/i),
});

export type CreateUserBody = z.infer<typeof createUserSchema>;
export type UpdateUserBody = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
