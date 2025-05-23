import { IAccountRepository } from '../../repositories/IAccountRepository';
import { ITransactionRepository } from '../../repositories/ITransactionRespository';
import { IUnitOfWork } from '../../repositories/IUnitOfWork';
import { IUserRepository } from '../../repositories/IUserRepository';

export class UnitOfWorkMock implements IUnitOfWork {
  private inTransaction = false;

  constructor(
    public userRepository: IUserRepository,
    public accountRepository: IAccountRepository,
    public transactionRepository: ITransactionRepository,
  ) {}

  async start(): Promise<void> {
    if (this.inTransaction) {
      throw new Error('Transaction already started');
    }
    this.inTransaction = true;
  }

  async commit(): Promise<void> {
    if (!this.inTransaction) {
      throw new Error('No transaction to commit');
    }
    this.inTransaction = false;
  }

  async rollback(): Promise<void> {
    if (!this.inTransaction) {
      throw new Error('No transaction to rollback');
    }
    this.inTransaction = false;
  }

  isInTransaction(): boolean {
    return this.inTransaction;
  }
}
