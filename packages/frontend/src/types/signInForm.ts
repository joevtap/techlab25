import z from 'zod';

export const SignInFormSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(5, 'Email deve conter pelo menos 5 caracteres'),
  password: z.string().min(8, 'Senha deve conter pelo menos 8 caracteres'),
});

export type SignInFormValues = z.infer<typeof SignInFormSchema>;
