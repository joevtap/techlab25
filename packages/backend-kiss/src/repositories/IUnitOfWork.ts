import { IAccountRepository } from './IAccountRepository';
import { IUserRepository } from './IUserRepository';

export interface IUnitOfWork {
  userRepository: IUserRepository;
  accountRepository: IAccountRepository;

  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
