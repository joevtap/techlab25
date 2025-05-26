import { z } from 'zod';

export const SignUpFormSchema = z.object({
  username: z
    .string()
    .min(2, 'Nome de usuário deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .email('Email inválido')
    .min(5, 'Email deve conter pelo menos 5 caracteres'),
  password: z.string().min(8, 'Senha deve conter pelo menos 8 caracteres'),
});

export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;
