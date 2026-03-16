import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1),
      unitPriceCents: z.number().int().min(0),
    })
  ).min(1),
});

export const orderIdParamSchema = z.object({
  id: z.string().length(24).regex(/^[a-f0-9]+$/i),
});

export type CreateOrderBody = z.infer<typeof createOrderSchema>;
export type OrderIdParam = z.infer<typeof orderIdParamSchema>;
