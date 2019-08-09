import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class CharacterBalance1565357452668 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` ADD `balance` int NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` DROP COLUMN `balance`");
    }

}
