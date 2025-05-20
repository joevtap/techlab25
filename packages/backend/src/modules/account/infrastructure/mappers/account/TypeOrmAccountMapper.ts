import { Id } from '../../../../../core/domain/value-objects';
import { Account } from '../../../domain/entities/Account';
import { AccountNumber } from '../../../domain/value-objects/AccountNumber';
import { AccountType } from '../../../domain/value-objects/AccountType';
import { Balance } from '../../../domain/value-objects/Balance';
import { AccountEntity } from '../../orm/entities/AccountEntity';

export class TypeOrmAccountMapper {
  public static toDomain(input: AccountEntity): Account {
    return Account.create({
      id: new Id(input.id),
      accountNumber: new AccountNumber(input.accountNumber),
      balance: new Balance(input.balance),
      type: new AccountType(input.type),
      ownerId: new Id(input.ownerId),
    });
  }

  public static toTypeOrm(input: Account): AccountEntity {
    return {
      id: input.id.toString(),
      accountNumber: input.accountNumber.toString(),
      type: input.type.toString(),
      balance: input.balance.getValue(),
      ownerId: input.ownerId.toString(),
    };
  }
}
