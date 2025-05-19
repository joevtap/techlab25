import { z, ZodError } from 'zod';
import { ValidationError } from '../../errors';

export class Username {
  private readonly value: string;

  public constructor(value: string) {
    try {
      const schema = z
        .string()
        .min(3, 'Username is too small')
        .max(255, 'Username is too big');

      schema.parse(value);

      this.value = value;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.errors.map((e) => e.message).join(', '),
        );
      }

      throw error;
    }
  }

  public equals(username: Username): boolean {
    return this.value === username.value;
  }

  public toString(): string {
    return this.value;
  }
}
