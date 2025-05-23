export class Id {
  private readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public equals(id: Id): boolean {
    return this.value === id.value;
  }

  public toString(): string {
    return this.value;
  }
}
