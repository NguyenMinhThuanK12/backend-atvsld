import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1747896350745 implements MigrationInterface {
    name = 'InitSchema1747896350745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departments" ALTER COLUMN "business_license_file" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "departments" ALTER COLUMN "other_document_file" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departments" ALTER COLUMN "other_document_file" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "departments" ALTER COLUMN "business_license_file" SET NOT NULL`);
    }

}
