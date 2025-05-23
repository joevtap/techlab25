import { z } from 'zod/v4';

export type SignUserInRequest = z.infer<typeof SignUserInSchema>;

export const SignUserInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
