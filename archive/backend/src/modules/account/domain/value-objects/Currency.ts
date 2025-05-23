export class Currency {
  private readonly value: number; // integer

  public constructor(value: number) {
    this.value = value;
  }

  public equals(currency: Currency) {
    return this.value === currency.value;
  }

  public getValue(): number {
    return this.value;
  }

  public toString(): string {
    return `${(this.value / 100).toFixed(2)} BRL`;
  }
}
