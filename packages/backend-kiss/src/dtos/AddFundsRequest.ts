import { z } from 'zod/v4';

export type AddFundsRequest = z.infer<typeof AddFundsSchema>;

export const AddFundsSchema = z.object({
  requestingUserId: z.nanoid(),
  accountNumber: z.string(),
  amount: z.int().min(1_00).max(10_000_00),
  description: z.string().optional(),
});
