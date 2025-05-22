import { Id } from '../entities/types';

export type ListUserAccountsRequest = {
  ownerId: Id;
  requestingUserId: Id;
};
