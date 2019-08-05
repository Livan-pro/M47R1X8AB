import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class UserRoles1564764668497 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `users` ADD `roles` int NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `roles`");
    }

}
