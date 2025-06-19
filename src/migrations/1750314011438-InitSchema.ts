import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1750314011438 implements MigrationInterface {
    name = 'InitSchema1750314011438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_details" ADD "accidentDeaths" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "report_details" ADD "machinesUnregistered" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "report_details" ADD "windNotQualified" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "report_details" ADD "vibrationNotQualified" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "report_details" ADD "emFieldNotQualified" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_details" DROP COLUMN "emFieldNotQualified"`);
        await queryRunner.query(`ALTER TABLE "report_details" DROP COLUMN "vibrationNotQualified"`);
        await queryRunner.query(`ALTER TABLE "report_details" DROP COLUMN "windNotQualified"`);
        await queryRunner.query(`ALTER TABLE "report_details" DROP COLUMN "machinesUnregistered"`);
        await queryRunner.query(`ALTER TABLE "report_details" DROP COLUMN "accidentDeaths"`);
    }

}
