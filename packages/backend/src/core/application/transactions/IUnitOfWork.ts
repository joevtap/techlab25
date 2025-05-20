export interface IUnitOfWork {
  runInTransaction<T>(
    callback: (transactionId: symbol) => Promise<T>,
  ): Promise<T>;
}
