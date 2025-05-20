import { AccountTypeEnum } from '../../domain/value-objects/AccountType';

export type AccountDto = {
  id: string;
  accountNumber: string;
  type: AccountTypeEnum;
  balance: number;
  ownerId: string;
};
