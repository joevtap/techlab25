import { AccountTypeEnum } from '../../domain/value-objects/AccountType';

export type CreateAccountExternalDto = {
  type: AccountTypeEnum;
  balance?: number;
};
