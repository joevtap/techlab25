export class TransactionDate {
  private readonly value: Date;

  public constructor(value: Date) {
    this.value = value;
  }

  public equals(date: TransactionDate) {
    return this.value === date.value;
  }

  public getValue(): Date {
    return this.value;
  }

  public toTimestamp(): number {
    return this.value.getUTCMilliseconds();
  }

  public toString(): string {
    return this.value.toUTCString();
  }
}
