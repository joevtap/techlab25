import { Container } from 'inversify';
import { DataSource } from 'typeorm';

import { IIdGenerator } from '../services/IIdGenerator';
import { IPasswordHasher } from '../services/IPasswordHasher';
import { ITokenService } from '../services/ITokenService';

import { TypeOrmDataSource } from './orm';
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

    this.container
      .bind<ITokenService>(TOKENS.TOKEN_SERVICE)
      .to(JwtTokenService);

    this.container
      .bind<IPasswordHasher>(TOKENS.PASSWORD_HASHER)
      .to(BcryptPasswordHasher);

    this.container.bind<IIdGenerator>(TOKENS.ID_GENERATOR).to(NanoIdGenerator);
  }
}
