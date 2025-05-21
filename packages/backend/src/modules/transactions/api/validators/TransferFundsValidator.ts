import { z } from 'zod';

import { TransferFundsExternalDto } from '../../application/dtos/TransferFundsExternalDto';

export class TransferFundsValidator {
  public static validate(
    dto: TransferFundsExternalDto,
  ): TransferFundsExternalDto {
    const schema = z.object({
      sourceAccountId: z.string().min(1, 'Source Account ID is required'),
      targetAccountId: z.string().min(1, 'Target Account ID is required'),
      amount: z.number().positive('Amount must be positive'),
      description: z.string().optional(),
    });

    return schema.parse(dto);
  }
}
