import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDateToDatetime1747949281673 implements MigrationInterface {
  name = 'ChangeDateToDatetime1747949281673';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_transactions" ("id" text PRIMARY KEY NOT NULL, "date" date NOT NULL, "amount" integer NOT NULL, "type" text NOT NULL, "description" text, "source_account" text, "target_account" text, CONSTRAINT "FK_c958f1d7b9976a2baed66f35604" FOREIGN KEY ("target_account") REFERENCES "accounts" ("number") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_840378adbcb2057add727f52bdf" FOREIGN KEY ("source_account") REFERENCES "accounts" ("number") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transactions"("id", "date", "amount", "type", "description", "source_account", "target_account") SELECT "id", "date", "amount", "type", "description", "source_account", "target_account" FROM "transactions"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_transactions" RENAME TO "transactions"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transactions" ("id" text PRIMARY KEY NOT NULL, "date" datetime NOT NULL, "amount" integer NOT NULL, "type" text NOT NULL, "description" text, "source_account" text, "target_account" text, CONSTRAINT "FK_c958f1d7b9976a2baed66f35604" FOREIGN KEY ("target_account") REFERENCES "accounts" ("number") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_840378adbcb2057add727f52bdf" FOREIGN KEY ("source_account") REFERENCES "accounts" ("number") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transactions"("id", "date", "amount", "type", "description", "source_account", "target_account") SELECT "id", "date", "amount", "type", "description", "source_account", "target_account" FROM "transactions"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_transactions" RENAME TO "transactions"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME TO "temporary_transactions"`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" text PRIMARY KEY NOT NULL, "date" date NOT NULL, "amount" integer NOT NULL, "type" text NOT NULL, "description" text, "source_account" text, "target_account" text, CONSTRAINT "FK_c958f1d7b9976a2baed66f35604" FOREIGN KEY ("target_account") REFERENCES "accounts" ("number") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_840378adbcb2057add727f52bdf" FOREIGN KEY ("source_account") REFERENCES "accounts" ("number") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "transactions"("id", "date", "amount", "type", "description", "source_account", "target_account") SELECT "id", "date", "amount", "type", "description", "source_account", "target_account" FROM "temporary_transactions"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_transactions"`);
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME TO "temporary_transactions"`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" text PRIMARY KEY NOT NULL, "date" date NOT NULL, "amount" integer NOT NULL, "type" text NOT NULL, "description" text, "source_account" text, "target_account" text, CONSTRAINT "FK_c958f1d7b9976a2baed66f35604" FOREIGN KEY ("target_account") REFERENCES "accounts" ("number") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_840378adbcb2057add727f52bdf" FOREIGN KEY ("source_account") REFERENCES "accounts" ("number") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "transactions"("id", "date", "amount", "type", "description", "source_account", "target_account") SELECT "id", "date", "amount", "type", "description", "source_account", "target_account" FROM "temporary_transactions"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_transactions"`);
  }
}
