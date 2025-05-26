import { MigrationInterface, QueryRunner } from "typeorm";

export class OnDeleteCascade1748270311082 implements MigrationInterface {
    name = 'OnDeleteCascade1748270311082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_accounts" ("id" text PRIMARY KEY NOT NULL, "type" text NOT NULL, "name" text NOT NULL, "number" text NOT NULL, "balance" integer NOT NULL, "owner_id" text, CONSTRAINT "UQ_6e3463d04ac45234992daec9ff1" UNIQUE ("number"))`);
        await queryRunner.query(`INSERT INTO "temporary_accounts"("id", "type", "name", "number", "balance", "owner_id") SELECT "id", "type", "name", "number", "balance", "owner_id" FROM "accounts"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`ALTER TABLE "temporary_accounts" RENAME TO "accounts"`);
        await queryRunner.query(`CREATE TABLE "temporary_transactions" ("id" text PRIMARY KEY NOT NULL, "date" datetime NOT NULL, "amount" integer NOT NULL, "type" text NOT NULL, "description" text, "source_account" text, "target_account" text)`);
        await queryRunner.query(`INSERT INTO "temporary_transactions"("id", "date", "amount", "type", "description", "source_account", "target_account") SELECT "id", "date", "amount", "type", "description", "source_account", "target_account" FROM "transactions"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_transactions" RENAME TO "transactions"`);
        await queryRunner.query(`CREATE TABLE "temporary_accounts" ("id" text PRIMARY KEY NOT NULL, "type" text NOT NULL, "name" text NOT NULL, "number" text NOT NULL, "balance" integer NOT NULL, "owner_id" text, CONSTRAINT "UQ_6e3463d04ac45234992daec9ff1" UNIQUE ("number"), CONSTRAINT "FK_e6c1947a61f955558ccca3f7c46" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_accounts"("id", "type", "name", "number", "balance", "owner_id") SELECT "id", "type", "name", "number", "balance", "owner_id" FROM "accounts"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`ALTER TABLE "temporary_accounts" RENAME TO "accounts"`);
        await queryRunner.query(`CREATE TABLE "temporary_transactions" ("id" text PRIMARY KEY NOT NULL, "date" datetime NOT NULL, "amount" integer NOT NULL, "type" text NOT NULL, "description" text, "source_account" text, "target_account" text, CONSTRAINT "FK_840378adbcb2057add727f52bdf" FOREIGN KEY ("source_account") REFERENCES "accounts" ("number") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_c958f1d7b9976a2baed66f35604" FOREIGN KEY ("target_account") REFERENCES "accounts" ("number") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_transactions"("id", "date", "amount", "type", "description", "source_account", "target_account") SELECT "id", "date", "amount", "type", "description", "source_account", "target_account" FROM "transactions"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_transactions" RENAME TO "transactions"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" RENAME TO "temporary_transactions"`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" text PRIMARY KEY NOT NULL, "date" datetime NOT NULL, "amount" integer NOT NULL, "type" text NOT NULL, "description" text, "source_account" text, "target_account" text)`);
        await queryRunner.query(`INSERT INTO "transactions"("id", "date", "amount", "type", "description", "source_account", "target_account") SELECT "id", "date", "amount", "type", "description", "source_account", "target_account" FROM "temporary_transactions"`);
        await queryRunner.query(`DROP TABLE "temporary_transactions"`);
        await queryRunner.query(`ALTER TABLE "accounts" RENAME TO "temporary_accounts"`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" text PRIMARY KEY NOT NULL, "type" text NOT NULL, "name" text NOT NULL, "number" text NOT NULL, "balance" integer NOT NULL, "owner_id" text, CONSTRAINT "UQ_6e3463d04ac45234992daec9ff1" UNIQUE ("number"))`);
        await queryRunner.query(`INSERT INTO "accounts"("id", "type", "name", "number", "balance", "owner_id") SELECT "id", "type", "name", "number", "balance", "owner_id" FROM "temporary_accounts"`);
        await queryRunner.query(`DROP TABLE "temporary_accounts"`);
        await queryRunner.query(`ALTER TABLE "transactions" RENAME TO "temporary_transactions"`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" text PRIMARY KEY NOT NULL, "date" datetime NOT NULL, "amount" integer NOT NULL, "type" text NOT NULL, "description" text, "source_account" text, "target_account" text, CONSTRAINT "FK_840378adbcb2057add727f52bdf" FOREIGN KEY ("source_account") REFERENCES "accounts" ("number") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c958f1d7b9976a2baed66f35604" FOREIGN KEY ("target_account") REFERENCES "accounts" ("number") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "transactions"("id", "date", "amount", "type", "description", "source_account", "target_account") SELECT "id", "date", "amount", "type", "description", "source_account", "target_account" FROM "temporary_transactions"`);
        await queryRunner.query(`DROP TABLE "temporary_transactions"`);
        await queryRunner.query(`ALTER TABLE "accounts" RENAME TO "temporary_accounts"`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" text PRIMARY KEY NOT NULL, "type" text NOT NULL, "name" text NOT NULL, "number" text NOT NULL, "balance" integer NOT NULL, "owner_id" text, CONSTRAINT "UQ_6e3463d04ac45234992daec9ff1" UNIQUE ("number"), CONSTRAINT "FK_e6c1947a61f955558ccca3f7c46" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "accounts"("id", "type", "name", "number", "balance", "owner_id") SELECT "id", "type", "name", "number", "balance", "owner_id" FROM "temporary_accounts"`);
        await queryRunner.query(`DROP TABLE "temporary_accounts"`);
    }

}
