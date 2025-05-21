import { z } from 'zod';

import { UserSignInDto } from '../../application/dtos/UserSignInDto';

export class UserSignInValidator {
  public static validate(dto: UserSignInDto): UserSignInDto {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    return schema.parse(dto);
  }
}
