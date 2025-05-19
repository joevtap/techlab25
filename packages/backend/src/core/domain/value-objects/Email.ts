import { z, ZodError } from 'zod';
import { ValidationError } from '../errors';

export class Email {
  private readonly value: string;

  public constructor(value: string) {
    try {
      const schema = z
        .string()
        .email('Not a valid email')
        .min(5, 'Email is too small')
        .max(255, 'Email is too big');

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

  public equals(email: Email): boolean {
    return this.value === email.value;
  }

  public toString(): string {
    return this.value;
  }
}
