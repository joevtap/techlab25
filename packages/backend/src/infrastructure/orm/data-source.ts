import { DataSource } from 'typeorm';

import { AccountEntity } from '../../modules/account/infrastructure/orm/entities/AccountEntity';
import { UserEntity } from '../../modules/auth/infrastructure/orm/entities';
import { TransactionEntity } from '../../modules/transactions/infrastructure/orm/TransactionEntity';

import { UsersAndAccounts1747753997203 } from './migrations/1747753997203-UsersAndAccounts';
import { AddTransaction1747793075273 } from './migrations/1747793075273-AddTransaction';
import { TransactionTypeTransfer1747793979952 } from './migrations/1747793979952-TransactionTypeTransfer';

export const applicationDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [UserEntity, AccountEntity, TransactionEntity],
  migrations: [
    UsersAndAccounts1747753997203,
    AddTransaction1747793075273,
    TransactionTypeTransfer1747793979952,
  ],
});
