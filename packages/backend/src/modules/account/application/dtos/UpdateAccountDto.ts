import { AccountTypeEnum } from '../../domain/value-objects/AccountType';

export type UpdateAccountDto = {
  id: string;
  type: AccountTypeEnum;
  requestingUserId: string;
};
