import { AccountTypeEnum } from '../../domain/value-objects/AccountType';

export type CreateAccountOutputDto = {
  id: string;
  accountNumber: string;
  type: AccountTypeEnum;
  balance: number;
};
