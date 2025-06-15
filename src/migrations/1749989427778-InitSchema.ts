import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1749989427778 implements MigrationInterface {
    name = 'InitSchema1749989427778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_instances" DROP COLUMN "is_overdue"`);
        await queryRunner.query(`ALTER TABLE "report_configurations" ADD "is_overdue" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_configurations" DROP COLUMN "is_overdue"`);
        await queryRunner.query(`ALTER TABLE "report_instances" ADD "is_overdue" boolean NOT NULL DEFAULT false`);
    }

}
