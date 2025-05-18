import { z } from 'zod';

export class Email {
  private constructor(public readonly value: string) {}

  public static create(email: string): Email {
    const emailSchema = z
      .string()
      .email('Not a valid email')
      .min(5, 'Email is too small')
      .max(255, 'Email is too big');

    emailSchema.parse(email);

    return new Email(email);
  }

  public equals(email: Email): boolean {
    return this.value === email.value;
  }

  toString(): string {
    return this.value;
  }
}
