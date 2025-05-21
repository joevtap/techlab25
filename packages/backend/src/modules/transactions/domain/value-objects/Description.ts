export class Description {
  private readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public equals(description: Description): boolean {
    return this.value === description.value;
  }

  public toString(): string {
    return this.value;
  }
}
