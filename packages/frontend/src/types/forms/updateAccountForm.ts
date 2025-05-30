import z from 'zod';

export const UpdateAccountFormSchema = z.object({
  name: z.string().min(2, 'Nome deve conter pelo menos 2 caracteres'),
  type: z.enum(['CHECKING', 'SAVINGS', 'INVESTMENTS'], {
    message: 'Tipo de conta inválido',
  }),
});

export type UpdateAccountFormValues = z.infer<typeof UpdateAccountFormSchema>;
