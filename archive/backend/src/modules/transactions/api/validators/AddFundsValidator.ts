import { z } from 'zod';

import { AddFundsExternalDto } from '../../application/dtos/AddFundsExternalDto';

export class AddFundsValidator {
  public static validate(dto: AddFundsExternalDto): AddFundsExternalDto {
    const schema = z.object({
      accountId: z.string().min(1, 'Account ID is required'),
      amount: z.number().positive('Amount must be positive'),
      description: z.string().optional(),
    });

    return schema.parse(dto);
  }
}
