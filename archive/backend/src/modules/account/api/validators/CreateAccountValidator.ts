import { z } from 'zod';

import { CreateAccountExternalDto } from '../../application/dtos/CreateAccountExternalDto';

export class CreateAccountValidator {
  public static validate(
    dto: CreateAccountExternalDto,
  ): CreateAccountExternalDto {
    const schema = z.object({
      type: z.enum(['CHECKING', 'SAVINGS', 'INVESTMENTS']),
      balance: z.number().int().optional(),
    });

    return schema.parse(dto);
  }
}
