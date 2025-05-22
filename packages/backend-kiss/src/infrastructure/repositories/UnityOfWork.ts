import { injectable, inject } from 'inversify';
import { DataSource, QueryRunner } from 'typeorm';

import { IAccountRepository } from '../../repositories/IAccountRepository';
import { IUnitOfWork } from '../../repositories/IUnitOfWork';
import { IUserRepository } from '../../repositories/IUserRepository';
import { TOKENS } from '../Tokens';

import { AccountRepository } from './AccountRepository';
import { UserRepository } from './UserRepository';

@injectable()
export class UnitOfWork implements IUnitOfWork {
  private queryRunner?: QueryRunner;

  public constructor(
    @inject(TOKENS.DATA_SOURCE) private dataSource: DataSource,

    @inject(TOKENS.USER_REPOSITORY) public userRepository: IUserRepository,

    @inject(TOKENS.ACCOUNT_REPOSITORY)
    public accountRepository: IAccountRepository,
  ) {}

  public async start() {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction('SERIALIZABLE');

    const transactionalManager = this.queryRunner.manager;
    (this.userRepository as UserRepository).manager = transactionalManager;
    (this.accountRepository as AccountRepository).manager =
      transactionalManager;
  }

  public async commit() {
    if (!this.queryRunner) throw new Error('Transaction not started');

    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
    this.queryRunner = undefined;

    (this.userRepository as UserRepository).manager = this.dataSource.manager;
    (this.accountRepository as AccountRepository).manager =
      this.dataSource.manager;
  }

  public async rollback() {
    if (!this.queryRunner) throw new Error('Transaction not started');

    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
    this.queryRunner = undefined;

    (this.userRepository as UserRepository).manager = this.dataSource.manager;
    (this.accountRepository as AccountRepository).manager =
      this.dataSource.manager;
  }
}
