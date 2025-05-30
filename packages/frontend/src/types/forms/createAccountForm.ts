import z from 'zod';

export const CreateAccountFormSchema = z.object({
  name: z.string().min(2, 'Nome deve conter pelo menos 2 caracteres'),
  balance: z
    .number({
      message: 'Saldo inicial é obrigatório',
    })
    .int('Saldo inicial deve ser em centavos')
    .min(100, 'Saldo inicial deve ser pelo menos R$ 1,00')
    .max(10_000_00, 'Saldo inicial não pode ser maior que R$ 10.000,00'),
  type: z.enum(['CHECKING', 'SAVINGS', 'INVESTMENTS'], {
    message: 'Tipo de conta inválido',
  }),
});

export type CreateAccountFormValues = z.infer<typeof CreateAccountFormSchema>;
