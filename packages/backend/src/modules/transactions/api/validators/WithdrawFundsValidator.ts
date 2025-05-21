import { z } from 'zod';

import { WithdrawFundsExternalDto } from '../../application/dtos/WithdrawFundsExternalDto';

export class WithdrawFundsValidator {
  public static validate(
    dto: WithdrawFundsExternalDto,
  ): WithdrawFundsExternalDto {
    const schema = z.object({
      accountId: z.string().min(1, 'Account ID is required'),
      amount: z.number().positive('Amount must be positive'),
      description: z.string().optional(),
    });

    return schema.parse(dto);
  }
}
