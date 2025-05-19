export class HashedPassword {
  private readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public equals(hashedPassword: HashedPassword): boolean {
    return this.value === hashedPassword.value;
  }

  public toString(): string {
    return this.value;
  }
}
