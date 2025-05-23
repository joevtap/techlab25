import { z } from 'zod/v4';

export type ListUserAccountsRequest = z.infer<typeof ListUserAccountsSchema>;

export const ListUserAccountsSchema = z.object({
  ownerId: z.nanoid(),
  requestingUserId: z.nanoid(),
});
