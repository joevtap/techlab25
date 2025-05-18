import { z } from 'zod';

export class Username {
  private constructor(public readonly value: string) {}

  public static create(username: string): Username {
    const usernameSchema = z
      .string()
      .min(3, 'Username is too small')
      .max(255, 'Username is too big');

    usernameSchema.parse(username);

    return new Username(username);
  }

  public equals(username: Username): boolean {
    return this.value === username.value;
  }

  toString(): string {
    return this.value;
  }
}
