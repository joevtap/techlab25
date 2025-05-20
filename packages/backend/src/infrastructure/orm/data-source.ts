import { DataSource } from 'typeorm';

import { AccountEntity } from '../../modules/account/infrastructure/orm/entities/AccountEntity';
import { UserEntity } from '../../modules/auth/infrastructure/orm/entities';

import { UsersAndAccounts1747752325673 } from './migrations/1747752325673-UsersAndAccounts';

export const applicationDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [UserEntity, AccountEntity],
  migrations: [UsersAndAccounts1747752325673],
});
