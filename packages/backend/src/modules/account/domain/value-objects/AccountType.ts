export type AccountTypeEnum = 'CHECKING' | 'SAVINGS' | 'INVESTMENTS';

export class AccountType {
  private readonly value: AccountTypeEnum;

  public constructor(value: AccountTypeEnum) {
    this.value = value;
  }

  public equals(accountType: AccountType) {
    return this.value === accountType.value;
  }

  public toString(): AccountTypeEnum {
    return this.value;
  }
}
