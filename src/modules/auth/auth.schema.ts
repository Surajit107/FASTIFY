import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(256),
});

export type LoginBody = z.infer<typeof loginSchema>;
export type RegisterBody = z.infer<typeof registerSchema>;
