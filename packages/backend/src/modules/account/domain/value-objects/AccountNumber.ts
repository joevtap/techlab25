export class AccountNumber {
  private readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public equals(accountNumber: AccountNumber) {
    return this.value === accountNumber.value;
  }

  public toString(): string {
    return this.value;
  }
}
