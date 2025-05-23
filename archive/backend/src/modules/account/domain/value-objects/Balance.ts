export class Balance {
  private readonly value: number; // integer

  public constructor(value: number) {
    this.value = value;
  }

  public equals(balance: Balance) {
    return this.value === balance.value;
  }

  public getValue(): number {
    return this.value;
  }

  public toString(): string {
    return `${(this.value / 100).toFixed(2)} BRL`;
  }
}
