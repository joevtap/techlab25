import { DataSource } from 'typeorm';

import {
  UserPersistenceEntity,
  AccountPersistenceEntity,
  TransactionPersistenceEntity,
} from './entities';
import { InitDb1747919198591 } from './migrations/1747919198591-InitDb';
import { ChangeDateToDatetime1747949281673 } from './migrations/1747949281673-ChangeDateToDatetime';
import { OnDeleteCascade1748270311082 } from './migrations/1748270311082-OnDeleteCascade';

export const TypeOrmDataSource = new DataSource({
  type: 'sqlite',
  database: './sqlite.db',
  entities: [
    UserPersistenceEntity,
    AccountPersistenceEntity,
    TransactionPersistenceEntity,
  ],
  migrations: [
    InitDb1747919198591,
    ChangeDateToDatetime1747949281673,
    OnDeleteCascade1748270311082,
  ],
});
