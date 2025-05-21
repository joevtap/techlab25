import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionTypeTransfer1747793979952 implements MigrationInterface {
    name = 'TransactionTypeTransfer1747793979952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_811faa40e043801b0a4b3737d27"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_7f681ce46f24957781c744c3561"`);
        await queryRunner.query(`ALTER TYPE "public"."transactions_type_enum" RENAME TO "transactions_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('CREDIT', 'DEBIT', 'TRANSFER')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "type" TYPE "public"."transactions_type_enum" USING "type"::"text"::"public"."transactions_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "from_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "to_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_811faa40e043801b0a4b3737d27" FOREIGN KEY ("from_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_7f681ce46f24957781c744c3561" FOREIGN KEY ("to_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_7f681ce46f24957781c744c3561"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_811faa40e043801b0a4b3737d27"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "to_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "from_id" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum_old" AS ENUM('CREDIT', 'DEBIT')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "type" TYPE "public"."transactions_type_enum_old" USING "type"::"text"::"public"."transactions_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transactions_type_enum_old" RENAME TO "transactions_type_enum"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_7f681ce46f24957781c744c3561" FOREIGN KEY ("to_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_811faa40e043801b0a4b3737d27" FOREIGN KEY ("from_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
