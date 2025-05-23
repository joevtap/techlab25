import { z } from 'zod/v4';

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;

export const CreateUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  username: z.string().min(2),
});
