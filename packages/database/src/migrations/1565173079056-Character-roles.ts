import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class CharacterRoles1565173079056 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` ADD `roles` int NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` DROP COLUMN `roles`");
    }

}
