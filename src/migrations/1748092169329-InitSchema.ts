import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1748092169329 implements MigrationInterface {
    name = 'InitSchema1748092169329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."permissions_type_enum" AS ENUM('Group', 'Component')`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "code" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "type" "public"."permissions_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_8dad765629e83229da6feda1c1d" UNIQUE ("code"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "code" character varying(30) NOT NULL, "name" character varying(30) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "department_id" integer, CONSTRAINT "UQ_f6d54f95c31b73fb1bdd8e91d0c" UNIQUE ("code"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('Nam', 'Nữ', 'Khác')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "account" character varying(50) NOT NULL, "password" character varying(255) NOT NULL, "full_name" character varying(100) NOT NULL, "job_title" character varying(100), "gender" "public"."users_gender_enum" NOT NULL, "birthday" date, "email" character varying(100) NOT NULL, "phone" character varying(15), "department_id" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "avatar_url" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "role_id" integer, CONSTRAINT "UQ_dd44b05034165835d6dcc18d684" UNIQUE ("account"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."departments_business_type_enum" AS ENUM('Doanh nghiệp tư nhân', 'Doanh nghiệp nhà nước', 'DN có vốn đầu tư nước ngoài (FDI)', 'Công ty TNHH', 'Công ty hợp danh', 'Loại hình khác')`);
        await queryRunner.query(`CREATE TABLE "departments" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "tax_code" character varying(20) NOT NULL, "established_date" date NOT NULL, "business_type" "public"."departments_business_type_enum" NOT NULL, "main_business_field" character varying NOT NULL, "registration_city" character varying NOT NULL, "registration_district" character varying NOT NULL, "registration_ward" character varying NOT NULL, "registration_address" character varying, "operation_city" character varying, "operation_district" character varying, "operation_ward" character varying, "operation_address" character varying, "foreign_name" character varying, "email" character varying, "phone_number" character varying, "representative_name" character varying, "representative_phone" character varying, "is_active" boolean NOT NULL DEFAULT true, "business_license_file" character varying, "other_document_file" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_tokens" ("id" SERIAL NOT NULL, "refresh_token" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "password_resets" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "token" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4816377aa98211c1de34469e742" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_f9842b21d158bb60985c03a9813" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_0921d1972cf861d568f5271cd85" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_tokens" ADD CONSTRAINT "FK_92ce9a299624e4c4ffd99b645b6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_tokens" DROP CONSTRAINT "FK_92ce9a299624e4c4ffd99b645b6"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_0921d1972cf861d568f5271cd85"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_f9842b21d158bb60985c03a9813"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`DROP TABLE "password_resets"`);
        await queryRunner.query(`DROP TABLE "user_tokens"`);
        await queryRunner.query(`DROP TABLE "departments"`);
        await queryRunner.query(`DROP TYPE "public"."departments_business_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TYPE "public"."permissions_type_enum"`);
    }

}
