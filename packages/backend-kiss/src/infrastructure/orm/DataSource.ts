import { DataSource } from 'typeorm';

import {
  UserPersistenceEntity,
  AccountPersistenceEntity,
  TransactionPersistenceEntity,
} from './entities';
import { InitDb1747919198591 } from './migrations/1747919198591-InitDb';

export const TypeOrmDataSource = new DataSource({
  type: 'sqlite',
  database: './sqlite.db',
  entities: [
    UserPersistenceEntity,
    AccountPersistenceEntity,
    TransactionPersistenceEntity,
  ],
  migrations: [InitDb1747919198591],
});
