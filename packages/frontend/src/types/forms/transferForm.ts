import z from 'zod';

export const TransferFormSchema = z
  .object({
    sourceAccountNumber: z.string({
      required_error: 'Conta de origem é obrigatória',
    }),
    targetAccountNumber: z.string({
      required_error: 'Conta de destino é obrigatória',
    }),
    amount: z
      .number({
        required_error: 'Valor da transferência é obrigatório',
        invalid_type_error: 'Valor deve ser um número',
      })
      .int('Valor deve ser em centavos')
      .min(100, 'Valor mínimo para transferência é R$ 1,00')
      .max(10_000_00, 'Valor máximo para transferência é R$ 10.000,00'),
    description: z.string().optional(),
  })
  .refine((data) => data.sourceAccountNumber !== data.targetAccountNumber, {
    message: 'Conta de origem e destino não podem ser iguais',
    path: ['targetAccountNumber'],
  });

export type TransferFormValues = z.infer<typeof TransferFormSchema>;
