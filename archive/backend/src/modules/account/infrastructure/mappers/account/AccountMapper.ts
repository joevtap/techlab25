import { AccountDto } from '../../../application/dtos/AccountDto';
import { AccountsDto } from '../../../application/dtos/AccountsDto';
import { Account } from '../../../domain/entities/Account';

export class AccountMapper {
  public static toDto(account: Account): AccountDto {
    return {
      id: account.id.toString(),
      accountNumber: account.accountNumber.toString(),
      type: account.type.toString(),
      balance: account.balance.getValue(),
      ownerId: account.ownerId.toString(),
    };
  }

  public static mapToDto(accounts: Account[]): AccountsDto {
    return {
      accounts: accounts.map(this.toDto),
    };
  }
}
