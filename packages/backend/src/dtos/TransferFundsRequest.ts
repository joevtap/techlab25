import { z } from 'zod/v4';

export type TransferFundsRequest = z.infer<typeof TransferFundsSchema>;

export const TransferFundsSchema = z.object({
  requestingUserId: z.nanoid(),
  sourceAccountNumber: z.string(),
  targetAccountNumber: z.string(),
  amount: z.int().min(1_00).max(10_000_00),
  description: z.string().optional(),
});
