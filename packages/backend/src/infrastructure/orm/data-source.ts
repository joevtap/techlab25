import { DataSource } from 'typeorm';
import { UserEntity } from '../../modules/auth/infrastructure/orm/entities';
import { User1747604528508 } from './migrations/1747604528508-User';
import { User1747613470867 } from './migrations/1747613470867-User';

export const ApplicationDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [UserEntity],
  migrations: [User1747604528508, User1747613470867],
});
