import { EntityManager } from 'typeorm';

export interface RepositoryOptions {
  transactionManager?: EntityManager;
}
