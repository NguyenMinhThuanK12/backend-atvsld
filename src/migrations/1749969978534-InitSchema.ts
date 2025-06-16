import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1749969978534 implements MigrationInterface {
    name = 'InitSchema1749969978534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gender" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gender" SET NOT NULL`);
    }

}
