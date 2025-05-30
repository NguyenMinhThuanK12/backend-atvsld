import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1748532742876 implements MigrationInterface {
    name = 'InitSchema1748532742876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_cde4b2aabca86cfabdc78b537f0"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "business_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_cde4b2aabca86cfabdc78b537f0" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_cde4b2aabca86cfabdc78b537f0"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "business_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_cde4b2aabca86cfabdc78b537f0" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
