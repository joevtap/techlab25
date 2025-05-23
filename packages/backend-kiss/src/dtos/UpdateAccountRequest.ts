import { z } from 'zod/v4';

import { AccountTypeArray } from '../entities/types';

export type UpdateAccountRequest = z.infer<typeof UpdateAccountSchema>;

export const UpdateAccountSchema = z.object({
  id: z.nanoid(),
  name: z.string(),
  type: z.enum(AccountTypeArray),
  requestingUserId: z.nanoid(),
});
