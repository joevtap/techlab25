import z from 'zod';

export const DepositFormSchema = z.object({
  accountNumber: z.string({
    required_error: 'Conta é obrigatória',
  }),
  amount: z
    .number({
      required_error: 'Valor do depósito é obrigatório',
      invalid_type_error: 'Valor deve ser um número',
    })
    .int('Valor deve ser em centavos')
    .min(100, 'Valor mínimo para depósito é R$ 1,00')
    .max(10_000_00, 'Valor máximo para depósito é R$ 10.000,00'),
  description: z.string().optional(),
});

export type DepositFormValues = z.infer<typeof DepositFormSchema>;
