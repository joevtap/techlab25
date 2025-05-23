import { z } from 'zod/v4';

export type ListTransactionsByAccountNumberRequest = z.infer<
  typeof ListTransactionsByAccountNumberSchema
>;

export const ListTransactionsByAccountNumberSchema = z.object({
  requestingUserId: z.nanoid(),
  accountNumber: z.string(),
  from: z.date().optional(),
  to: z.date().optional(),
});
