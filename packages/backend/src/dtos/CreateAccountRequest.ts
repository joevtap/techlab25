import { z } from 'zod/v4';

import { AccountTypeArray } from '../entities/types';

export type CreateAccountRequest = z.infer<typeof CreateAccountSchema>;

export const CreateAccountSchema = z.object({
  name: z.string().min(2),
  balance: z.int().min(1_00).max(10_000_00),
  type: z.enum(AccountTypeArray),
  ownerId: z.nanoid(),
  requestingUserId: z.nanoid(),
});
