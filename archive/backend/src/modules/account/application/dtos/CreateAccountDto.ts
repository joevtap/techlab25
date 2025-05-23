import { AccountTypeEnum } from '../../domain/value-objects/AccountType';

export type CreateAccountDto = {
  accountNumber: string;
  type: AccountTypeEnum;
  balance: number;
  ownerId: string;
  requestingUserId: string;
};
