import {
  Container,
  ContainerModule,
  ContainerModuleLoadOptions,
} from 'inversify';
import { Repository } from 'typeorm';
import { applicationDataSource } from './infrastructure/orm/data-source';
import { NanoIdGenerator } from './infrastructure/services/NanoIdGenerator';
import { IIdGenerator } from './core/domain/services/IIdGenerator';
import { IPasswordHasher } from './modules/auth/domain/services/IPasswordHasher';
import { UserEntity } from './modules/auth/infrastructure/orm/entities';
import { BcryptPasswordHasher } from './modules/auth/infrastructure/services/BcryptPasswordHasher';
import { CreateUserUseCase } from './modules/auth/application/use-cases/CreateUserUseCase';
import { IUserRepository } from './modules/auth/domain/repositories/IUserRepository';
import { TypeOrmUserRepository } from './modules/auth/infrastructure/repositories/TypeOrmUserRepository';
import { UserController } from './modules/auth/api/controllers/User';

const container = new Container({ defaultScope: 'Request' });

export async function initializeDiContainer() {
  const authModule: ContainerModule = new ContainerModule(
    (options: ContainerModuleLoadOptions) => {
      options
        .bind<Repository<UserEntity>>(Symbol.for('TypeOrmUserEntityRepository'))
        .toDynamicValue(() => {
          return applicationDataSource.getRepository(UserEntity);
        });

      options
        .bind<IUserRepository>(Symbol.for('UserRepository'))
        .to(TypeOrmUserRepository);

      options
        .bind<IPasswordHasher>(Symbol.for('PasswordHasher'))
        .to(BcryptPasswordHasher);

      options.bind<IIdGenerator>(Symbol.for('IdGenerator')).to(NanoIdGenerator);

      options
        .bind<CreateUserUseCase>(Symbol.for('CreateUserUseCase'))
        .to(CreateUserUseCase);

      options
        .bind<UserController>(Symbol.for('UserController'))
        .to(UserController);
    },
  );

  container.load(authModule);
}

export { container };
