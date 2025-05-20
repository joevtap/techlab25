import { IUnitOfWork } from '../application/transactions/IUnitOfWork';

export class MockUnitOfWork implements IUnitOfWork {
  public transactionExecuted = false;
  public lastTransactionId: symbol | null = null;

  public async runInTransaction<T>(
    callback: (transactionId: symbol) => Promise<T>,
  ): Promise<T> {
    const transactionId = Symbol('mock-transaction');
    this.lastTransactionId = transactionId;
    this.transactionExecuted = true;

    return await callback(transactionId);
  }

  public reset(): void {
    this.transactionExecuted = false;
    this.lastTransactionId = null;
  }
}
