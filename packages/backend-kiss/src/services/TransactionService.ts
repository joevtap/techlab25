import { inject, injectable } from 'inversify';

import {
  AddFundsRequest,
  AddFundsResponse,
  ListTransactionsByAccountNumberRequest,
  ListTransactionsByAccountNumberResponse,
  TransferFundsRequest,
  TransferFundsResponse,
  WithdrawFundsRequest,
  WithdrawFundsResponse,
} from '../dtos';
import { Transaction } from '../entities/Transaction';
import { BusinessRuleViolationError } from '../errors/BusinessRuleViolationError';
import { NotFoundError } from '../errors/NotFoundError';
import { TOKENS } from '../infrastructure/Tokens';
import { IUnitOfWork } from '../repositories/IUnitOfWork';

import { IIdGenerator } from './IIdGenerator';

@injectable()
export class TransactionService {
  public constructor(
    @inject(TOKENS.UOW) private readonly uow: IUnitOfWork,
    @inject(TOKENS.ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  public async transferFunds(
    request: TransferFundsRequest,
  ): Promise<TransferFundsResponse> {
    return this.executeWithTransaction(async () => {
      const sourceAccount = await this.uow.accountRepository.findByNumber(
        request.sourceAccountNumber,
      );

      if (!sourceAccount) {
        throw new NotFoundError('Source Account', request.sourceAccountNumber);
      }

      this.validateRequestingUserOwnsAccount(
        request.requestingUserId,
        sourceAccount.ownerId,
      );

      const targetAccount = await this.uow.accountRepository.findByNumber(
        request.targetAccountNumber,
      );

      if (!targetAccount) {
        throw new NotFoundError('Target Account', request.targetAccountNumber);
      }

      if (request.amount <= 0) {
        throw new BusinessRuleViolationError('Amount must be positive');
      }

      if (request.sourceAccountNumber === request.targetAccountNumber) {
        throw new BusinessRuleViolationError(
          'Cannot transfer to the same account',
        );
      }

      const transactionId = this.idGenerator.generate();
      const transaction = Transaction.newTransfer()
        .withId(transactionId)
        .withSource(request.sourceAccountNumber)
        .withTarget(request.targetAccountNumber)
        .withAmount(request.amount)
        .withDescription(request.description || 'Transfer funds')
        .build();

      const updatedSourceAccount = sourceAccount.withdraw(request.amount);
      const updatedTargetAccount = targetAccount.deposit(request.amount);

      await this.uow.accountRepository.update(updatedSourceAccount);
      await this.uow.accountRepository.update(updatedTargetAccount);
      await this.uow.transactionRepository.add(transaction);

      return {
        id: transactionId,
        sourceAccountNumber: request.sourceAccountNumber,
        targetAccountNumber: request.targetAccountNumber,
        amount: request.amount,
      };
    });
  }

  public async listTransactionsByAccountNumber(
    request: ListTransactionsByAccountNumberRequest,
  ): Promise<ListTransactionsByAccountNumberResponse> {
    return this.executeWithTransaction(async () => {
      const account = await this.uow.accountRepository.findByNumber(
        request.accountNumber,
      );

      if (!account) {
        throw new NotFoundError('Account', request.accountNumber);
      }

      this.validateRequestingUserOwnsAccount(
        request.requestingUserId,
        account.ownerId,
      );

      const transactions =
        await this.uow.transactionRepository.findAllByAccountNumber(
          request.accountNumber,
          request.from,
          request.to,
        );

      return {
        transactions: transactions.map((transaction) => ({
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount,
          date: transaction.date,
          sourceAccountNumber: transaction.source,
          targetAccountNumber: transaction.target,
          description: transaction.description,
        })),
      };
    });
  }

  public async addFunds(request: AddFundsRequest): Promise<AddFundsResponse> {
    return this.executeWithTransaction(async () => {
      const account = await this.uow.accountRepository.findByNumber(
        request.accountNumber,
      );
      if (!account) {
        throw new NotFoundError('Account', request.accountNumber);
      }

      this.validateRequestingUserOwnsAccount(
        request.requestingUserId,
        account.ownerId,
      );

      if (request.amount <= 0) {
        throw new BusinessRuleViolationError('Amount must be positive');
      }

      const transactionId = this.idGenerator.generate();
      const transaction = Transaction.newCreditTransaction()
        .withId(transactionId)
        .withTarget(request.accountNumber)
        .withAmount(request.amount)
        .withDescription(request.description || 'Add funds')
        .build();

      const updatedAccount = account.deposit(request.amount);

      await this.uow.accountRepository.update(updatedAccount);
      await this.uow.transactionRepository.add(transaction);

      return {
        id: transactionId,
        accountNumber: request.accountNumber,
        amount: request.amount,
        newBalance: updatedAccount.balance,
      };
    });
  }

  public async withdrawFunds(
    request: WithdrawFundsRequest,
  ): Promise<WithdrawFundsResponse> {
    return this.executeWithTransaction(async () => {
      const account = await this.uow.accountRepository.findByNumber(
        request.accountNumber,
      );
      if (!account) {
        throw new NotFoundError('Account', request.accountNumber);
      }

      this.validateRequestingUserOwnsAccount(
        request.requestingUserId,
        account.ownerId,
      );

      if (request.amount <= 0) {
        throw new BusinessRuleViolationError('Amount must be positive');
      }

      const transactionId = this.idGenerator.generate();
      const transaction = Transaction.newDebitTransaction()
        .withId(transactionId)
        .withSource(request.accountNumber)
        .withAmount(request.amount)
        .withDescription(request.description || 'Withdraw funds')
        .build();

      const updatedAccount = account.withdraw(request.amount);

      await this.uow.accountRepository.update(updatedAccount);
      await this.uow.transactionRepository.add(transaction);

      return {
        id: transactionId,
        accountNumber: request.accountNumber,
        amount: request.amount,
        newBalance: updatedAccount.balance,
      };
    });
  }

  private async executeWithTransaction<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      await this.uow.start();
      const result = await operation();
      await this.uow.commit();
      return result;
    } catch (error) {
      await this.uow.rollback();
      throw error;
    }
  }

  private validateRequestingUserOwnsAccount(
    requestingUserId: string,
    accountOwnerId: string,
  ): void {
    if (requestingUserId !== accountOwnerId) {
      throw new BusinessRuleViolationError(
        'Requesting user does not own the account',
      );
    }
  }
}
