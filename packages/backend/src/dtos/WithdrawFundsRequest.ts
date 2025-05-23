import { z } from 'zod/v4';

export type WithdrawFundsRequest = z.infer<typeof WithdrawFundsSchema>;

export const WithdrawFundsSchema = z.object({
  requestingUserId: z.nanoid(),
  accountNumber: z.string(),
  amount: z.int().min(1_00).max(10_000_00),
  description: z.string().optional(),
});
