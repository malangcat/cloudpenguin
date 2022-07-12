import { z } from 'zod';

export const addItemSchema = z.object({
  name: z.string(),
  amount: z.number(),
});

export type AddItemDto = z.infer<typeof addItemSchema>;
