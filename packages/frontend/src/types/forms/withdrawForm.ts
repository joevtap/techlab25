import z from 'zod';

export const WithdrawFormSchema = z.object({
  accountNumber: z.string({
    required_error: 'Conta é obrigatória',
  }),
  amount: z
    .number({
      required_error: 'Valor do saque é obrigatório',
      invalid_type_error: 'Valor deve ser um número',
    })
    .int('Valor deve ser em centavos')
    .min(100, 'Valor mínimo para saque é R$ 1,00')
    .max(10_000_00, 'Valor máximo para saque é R$ 10.000,00'),
  description: z.string().optional(),
});

export type WithdrawFormValues = z.infer<typeof WithdrawFormSchema>;
