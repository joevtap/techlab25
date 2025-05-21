import { z } from 'zod';

import { TransferFundsByAccountNumberExternalDto } from '../../application/dtos/TransferFundsByAccountNumberExternalDto';

export class TransferFundsByAccountNumberValidator {
  public static validate(
    dto: TransferFundsByAccountNumberExternalDto,
  ): TransferFundsByAccountNumberExternalDto {
    const schema = z.object({
      sourceAccountNumber: z
        .string()
        .min(1, 'Source Account Number is required'),
      targetAccountNumber: z
        .string()
        .min(1, 'Target Account Number is required'),
      amount: z.number().positive('Amount must be positive'),
      description: z.string().optional(),
    });

    return schema.parse(dto);
  }
}
