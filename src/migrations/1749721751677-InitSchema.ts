import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1749721751677 implements MigrationInterface {
    name = 'InitSchema1749721751677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_details" ALTER COLUMN "riskAssessmentTime" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_details" ALTER COLUMN "riskAssessmentTime" DROP DEFAULT`);
    }

}
