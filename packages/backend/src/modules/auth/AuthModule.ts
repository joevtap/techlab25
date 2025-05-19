import { Container } from 'inversify';
import { Router } from 'express';
import { Repository } from 'typeorm';
import { IIdGenerator } from '../../core/domain/services/IIdGenerator';
import { applicationDataSource } from '../../infrastructure/orm/data-source';
import { NanoIdGenerator } from '../../infrastructure/services/NanoIdGenerator';
import { AuthController } from './api/controllers/Auth';
import { CreateUserUseCase } from './application/use-cases/CreateUserUseCase';
import { IUserRepository } from './domain/repositories/IUserRepository';
import { IPasswordHasher } from './domain/services/IPasswordHasher';
import { UserEntity } from './infrastructure/orm/entities';
import { TypeOrmUserRepository } from './infrastructure/repositories/TypeOrmUserRepository';
import { BcryptPasswordHasher } from './infrastructure/services/BcryptPasswordHasher';
import { Module } from '../../core/application/Module';

export class AuthModule extends Module {
  public readonly name = 'auth';

  public register(container: Container) {
    container
      .bind<Repository<UserEntity>>(Symbol.for('TypeOrmUserEntityRepository'))
      .toDynamicValue(() => {
        return applicationDataSource.getRepository(UserEntity);
      });

    container
      .bind<IUserRepository>(Symbol.for('UserRepository'))
      .to(TypeOrmUserRepository);

    container
      .bind<IPasswordHasher>(Symbol.for('PasswordHasher'))
      .to(BcryptPasswordHasher);

    container.bind<IIdGenerator>(Symbol.for('IdGenerator')).to(NanoIdGenerator);

    container
      .bind<CreateUserUseCase>(Symbol.for('CreateUserUseCase'))
      .to(CreateUserUseCase);

    container
      .bind<AuthController>(Symbol.for('AuthController'))
      .to(AuthController)
      .inSingletonScope();
  }

  public routers(
    container: Container,
  ): Array<{ path: string; router: Router }> {
    const authController = container.get<AuthController>(
      Symbol.for('AuthController'),
    );

    return [
      {
        path: '/',
        router: authController.router,
      },
    ];
  }
}
