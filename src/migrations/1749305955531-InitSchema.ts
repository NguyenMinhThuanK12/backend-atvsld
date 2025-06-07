import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1749305955531 implements MigrationInterface {
    name = 'InitSchema1749305955531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account" character varying(50) NOT NULL, "password" character varying(255) NOT NULL, "full_name" character varying(100) NOT NULL, "job_title" character varying(100), "gender" "public"."users_gender_enum" NOT NULL, "user_type" "public"."users_user_type_enum" NOT NULL, "birthday" date, "email" character varying(100) NOT NULL, "phone" character varying(15), "province" character varying(100), "district" character varying(100), "ward" character varying(100), "address" character varying(255), "role_id" uuid, "business_id" uuid, "is_active" boolean NOT NULL DEFAULT true, "avatar_url" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_dd44b05034165835d6dcc18d684" UNIQUE ("account"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_cde4b2aabca86cfabdc78b537f0" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_tokens" ADD CONSTRAINT "FK_92ce9a299624e4c4ffd99b645b6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_tokens" DROP CONSTRAINT "FK_92ce9a299624e4c4ffd99b645b6"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_cde4b2aabca86cfabdc78b537f0"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
