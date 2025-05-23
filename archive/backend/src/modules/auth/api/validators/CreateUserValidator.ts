import { z } from 'zod';

import { CreateUserDto } from '../../application/dtos/CreateUserDto';

export class CreateUserValidator {
  public static validate(dto: CreateUserDto): CreateUserDto {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      username: z.string().min(3),
    });

    return schema.parse(dto);
  }
}
