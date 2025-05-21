import { z } from 'zod';

import { UpdateAccountExternalDto } from '../../application/dtos/UpdateAccountExternalDto';

export class UpdateAccountValidator {
  public static validate(
    dto: UpdateAccountExternalDto,
  ): UpdateAccountExternalDto {
    const schema = z.object({
      type: z.enum(['CHECKING', 'SAVINGS', 'INVESTMENTS']),
    });

    return schema.parse(dto);
  }
}
