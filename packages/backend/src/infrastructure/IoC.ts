import { Container } from 'inversify';
import { DataSource } from 'typeorm';

import {
  UserController,
  AccountController,
  TransactionController,
} from '../controllers';
import { IAccountRepository } from '../repositories/IAccountRepository';
import { ITransactionRepository } from '../repositories/ITransactionRespository';
import { IUnitOfWork } from '../repositories/IUnitOfWork';
import { IUserRepository } from '../repositories/IUserRepository';
import { AccountService } from '../services/AccountService';
import { IIdGenerator } from '../services/IIdGenerator';
import { IPasswordHasher } from '../services/IPasswordHasher';
import { ITokenService } from '../services/ITokenService';
import { TransactionService } from '../services/TransactionService';
import { UserService } from '../services/UserService';

import { TypeOrmDataSource } from './orm';
import { AccountRepository } from './repositories/AccountRepository';
import { TransactionRepository } from './repositories/TransactionRepository';
import { UnitOfWork } from './repositories/UnityOfWork';
import { UserRepository } from './repositories/UserRepository';
import { BcryptPasswordHasher } from './services/BcryptPasswordHasher';
import { JwtTokenService } from './services/JwtTokenService';
import { NanoIdGenerator } from './services/NanoIdGenerator';
import { TOKENS } from './Tokens';

export class IoC {
  public static container: Container;

  public static initialize() {
    this.container = new Container({
      defaultScope: 'Singleton',
    });

    this.container
      .bind<DataSource>(TOKENS.DATA_SOURCE)
      .toConstantValue(TypeOrmDataSource);

    this.container.bind<IUnitOfWork>(TOKENS.UOW).to(UnitOfWork);

    this.container
      .bind<ITokenService>(TOKENS.TOKEN_SERVICE)
      .to(JwtTokenService);

    this.container
      .bind<IPasswordHasher>(TOKENS.PASSWORD_HASHER)
      .to(BcryptPasswordHasher);

    this.container.bind<IIdGenerator>(TOKENS.ID_GENERATOR).to(NanoIdGenerator);

    this.container
      .bind<IUserRepository>(TOKENS.USER_REPOSITORY)
      .to(UserRepository);

    this.container.bind<UserService>(TOKENS.USER_SERVICE).to(UserService);

    this.container
      .bind<IAccountRepository>(TOKENS.ACCOUNT_REPOSITORY)
      .to(AccountRepository);

    this.container
      .bind<AccountService>(TOKENS.ACCOUNT_SERVICE)
      .to(AccountService);

    this.container
      .bind<ITransactionRepository>(TOKENS.TRANSACTION_REPOSITORY)
      .to(TransactionRepository);

    this.container
      .bind<TransactionService>(TOKENS.TRANSACTION_SERVICE)
      .to(TransactionService);

    this.container
      .bind<UserController>(TOKENS.USER_CONTROLLER)
      .to(UserController);

    this.container
      .bind<AccountController>(TOKENS.ACCOUNT_CONTROLLER)
      .to(AccountController);

    this.container
      .bind<TransactionController>(TOKENS.TRANSACTION_CONTROLLER)
      .to(TransactionController);
  }
}
