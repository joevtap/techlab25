import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransaction1747793075273 implements MigrationInterface {
  name = 'AddTransaction1747793075273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_type_enum" AS ENUM('CREDIT', 'DEBIT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" text NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "from_id" text NOT NULL, "to_id" text NOT NULL, "value" integer NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_e6c1947a61f955558ccca3f7c46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "owner_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_e6c1947a61f955558ccca3f7c46" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_811faa40e043801b0a4b3737d27" FOREIGN KEY ("from_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_7f681ce46f24957781c744c3561" FOREIGN KEY ("to_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_7f681ce46f24957781c744c3561"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_811faa40e043801b0a4b3737d27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_e6c1947a61f955558ccca3f7c46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "owner_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_e6c1947a61f955558ccca3f7c46" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
  }
}
