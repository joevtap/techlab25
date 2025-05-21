export class TransactionValue {
  private readonly value: number; // integer

  public constructor(value: number) {
    this.value = value;
  }

  public equals(value: TransactionValue) {
    return this.value === value.value;
  }

  public getValue(): number {
    return this.value;
  }

  public toString(): string {
    return `${(this.value / 100).toFixed(2)} BRL`;
  }
}
