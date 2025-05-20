import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersAndAccounts1747752325673 implements MigrationInterface {
    name = 'UsersAndAccounts1747752325673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" text NOT NULL, "email" text NOT NULL, "username" text NOT NULL, "password_hash" text NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."accounts_type_enum" AS ENUM('CHECKING', 'SAVINGS', 'INVESTMENTS')`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" text NOT NULL, "account_number" text NOT NULL, "type" "public"."accounts_type_enum" NOT NULL DEFAULT 'CHECKING', "balance" integer NOT NULL, "owner_id" text NOT NULL, "ownerIdId" text, CONSTRAINT "UQ_ffd1ae96513bfb2c6eada0f7d31" UNIQUE ("account_number"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_f6274decccfd17b5f326e0e38e3" FOREIGN KEY ("ownerIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_f6274decccfd17b5f326e0e38e3"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TYPE "public"."accounts_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
