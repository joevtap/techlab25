import { IAccountRepository } from './IAccountRepository';
import { ITransactionRepository } from './ITransactionRespository';
import { IUserRepository } from './IUserRepository';

export interface IUnitOfWork {
  userRepository: IUserRepository;
  accountRepository: IAccountRepository;
  transactionRepository: ITransactionRepository;

  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
