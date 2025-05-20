// src/infrastructure/UnitOfWork.ts
import {
  DataSource,
  QueryRunner,
  Repository,
  ObjectType,
  ObjectLiteral,
} from 'typeorm';

export class UnitOfWork {
  private queryRunner!: QueryRunner;

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Create a new queryRunner, connect it, and start a DB transaction.
   */
  async start(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  /**
   * Grab a repository bound to this UoW’s transactional EntityManager.
   */
  getRepository<Entity extends ObjectLiteral>(
    entityClass: ObjectType<Entity>,
  ): Repository<Entity> {
    if (!this.queryRunner) {
      throw new Error('UnitOfWork not started. Call start() first.');
    }
    return this.queryRunner.manager.getRepository(entityClass);
  }

  /** Commit the transaction. */
  async commit(): Promise<void> {
    if (!this.queryRunner) return;
    await this.queryRunner.commitTransaction();
  }

  /** Roll the transaction back. */
  async rollback(): Promise<void> {
    if (!this.queryRunner) return;
    await this.queryRunner.rollbackTransaction();
  }

  /** Clean up the query runner so it can be used again later. */
  async release(): Promise<void> {
    if (!this.queryRunner) return;
    await this.queryRunner.release();
  }
}
