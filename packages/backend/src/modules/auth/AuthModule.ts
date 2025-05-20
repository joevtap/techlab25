import { Router } from 'express';
import { Container } from 'inversify';

import { Module } from '../../core/application/Module';

import { AuthController } from './api/controllers/Auth';
import { CreateUserUseCase } from './application/use-cases/CreateUserUseCase';
import { SignUserInUseCase } from './application/use-cases/SignUserInUseCase/SignUserInUseCase';
import { IUserRepository } from './domain/repositories/IUserRepository';
import { IPasswordHasher } from './domain/services/IPasswordHasher';
import { ITokenService } from './domain/services/ITokenService';
import { TypeOrmUserRepository } from './infrastructure/repositories/TypeOrmUserRepository';
import { BcryptPasswordHasher } from './infrastructure/services/BcryptPasswordHasher';
import { JwtTokenService } from './infrastructure/services/JwtTokenService';

export class AuthModule extends Module {
  public readonly name = 'auth';

  public register(container: Container) {
    container
      .bind<IUserRepository>(Symbol.for('UserRepository'))
      .to(TypeOrmUserRepository);

    container
      .bind<IPasswordHasher>(Symbol.for('PasswordHasher'))
      .to(BcryptPasswordHasher);

    container
      .bind<CreateUserUseCase>(Symbol.for('CreateUserUseCase'))
      .to(CreateUserUseCase);

    container
      .bind<SignUserInUseCase>(Symbol.for('SignUserInUseCase'))
      .to(SignUserInUseCase);

    container
      .bind<ITokenService>(Symbol.for('TokenService'))
      .to(JwtTokenService);

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
