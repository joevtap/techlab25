import { z } from 'zod/v4';

export type DeleteAccountRequest = z.infer<typeof DeleteAccountSchema>;

export const DeleteAccountSchema = z.object({
  accountId: z.nanoid(),
  requestingUserId: z.nanoid(),
});
