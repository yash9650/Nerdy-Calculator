import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedUserTable1694967436128 implements MigrationInterface {
    name = 'FixedUserTable1694967436128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "salt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "salt" character varying(255) NOT NULL`);
    }

}
