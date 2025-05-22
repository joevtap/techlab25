import { inject, injectable } from 'inversify';

import {
  CreateAccountRequest,
  CreateAccountResponse,
  DeleteAccountRequest,
  DeleteAccountResponse,
  ListUserAccountsRequest,
  ListUserAccountsResponse,
  UpdateAccountRequest,
  UpdateAccountResponse,
} from '../dtos';
import { Account } from '../entities/Account';
import { BusinessRuleViolationError } from '../errors/BusinessRuleViolationError';
import { NotFoundError } from '../errors/NotFoundError';
import { TOKENS } from '../infrastructure/Tokens';
import { IUnitOfWork } from '../repositories/IUnitOfWork';

import { IIdGenerator } from './IIdGenerator';

@injectable()
export class AccountService {
  private readonly MIN_BALANCE = 100;
  private readonly MAX_BALANCE = 10_000_00;

  public constructor(
    @inject(TOKENS.UOW) private readonly uow: IUnitOfWork,
    @inject(TOKENS.ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  public async createAccount(
    request: CreateAccountRequest,
  ): Promise<CreateAccountResponse> {
    return this.executeWithTransaction(async () => {
      this.validateRequestingUserIsOwner(
        request.requestingUserId,
        request.ownerId,
      );
      this.validateInitialBalance(request.balance);
      await this.validateUserExists(request.ownerId);

      const accountId = this.idGenerator.generate();
      const accountNumber = this.idGenerator.generate(10);

      const account = new Account(
        accountId,
        request.type,
        request.name,
        accountNumber,
        request.balance,
        request.ownerId,
      );

      return await this.uow.accountRepository.add(account);
    });
  }

  public async listUserAccounts(
    request: ListUserAccountsRequest,
  ): Promise<ListUserAccountsResponse> {
    return this.executeWithTransaction(async () => {
      this.validateRequestingUserIsOwner(
        request.requestingUserId,
        request.ownerId,
      );

      const accounts = await this.uow.accountRepository.findByOwnerId(
        request.ownerId,
      );

      return {
        accounts: accounts.map((account) => ({
          id: account.id,
          name: account.name,
          type: account.type,
          number: account.number,
          balance: account.balance,
          ownerId: account.ownerId,
        })),
      };
    });
  }

  public async updateAccount(
    request: UpdateAccountRequest,
  ): Promise<UpdateAccountResponse> {
    return this.executeWithTransaction(async () => {
      const existingAccount = await this.getAccountById(request.id);
      this.validateRequestingUserOwnsAccount(
        request.requestingUserId,
        existingAccount.ownerId,
      );

      const updatedAccount = new Account(
        existingAccount.id,
        request.type,
        request.name,
        existingAccount.number,
        existingAccount.balance,
        existingAccount.ownerId,
      );

      return await this.uow.accountRepository.update(updatedAccount);
    });
  }

  public async deleteAccount(
    request: DeleteAccountRequest,
  ): Promise<DeleteAccountResponse> {
    return this.executeWithTransaction(async () => {
      const existingAccount = await this.getAccountById(request.accountId);
      this.validateRequestingUserOwnsAccount(
        request.requestingUserId,
        existingAccount.ownerId,
      );

      await this.uow.accountRepository.remove(request.accountId);

      return { id: existingAccount.id };
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

  private validateRequestingUserIsOwner(
    requestingUserId: string,
    ownerId: string,
  ): void {
    if (requestingUserId !== ownerId) {
      throw new BusinessRuleViolationError(
        'User cannot perform operations for another user',
      );
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

  private validateInitialBalance(balance: number): void {
    if (balance < this.MIN_BALANCE) {
      throw new BusinessRuleViolationError(
        `Initial balance of ${balance} is too small. Minimum of ${this.MIN_BALANCE} allowed.`,
      );
    }

    if (balance > this.MAX_BALANCE) {
      throw new BusinessRuleViolationError(
        `Initial balance of ${balance} is too big. Maximum of ${this.MAX_BALANCE} allowed.`,
      );
    }
  }

  private async validateUserExists(userId: string): Promise<void> {
    const user = await this.uow.userRepository.findById(userId);
    if (!user) {
      throw new BusinessRuleViolationError('Account owner does not exist');
    }
  }

  private async getAccountById(accountId: string): Promise<Account> {
    const account = await this.uow.accountRepository.findById(accountId);
    if (!account) {
      throw new NotFoundError('Account', accountId);
    }
    return account;
  }
}
