import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class UserCity1565184127091 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `users` ADD `city` varchar(32) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `city`");
    }

}
