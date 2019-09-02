import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class CharacterState1567426143787 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` ADD `state` enum ('Normal', 'Pollution', 'SevereWound', 'Death') NOT NULL");
        await queryRunner.query("ALTER TABLE `characters` ADD `deathTime` datetime NULL");
        await queryRunner.query("ALTER TABLE `characters` ADD `pollution` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `characters` ADD `pollutionStartTime` datetime NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` DROP COLUMN `pollutionStartTime`");
        await queryRunner.query("ALTER TABLE `characters` DROP COLUMN `pollution`");
        await queryRunner.query("ALTER TABLE `characters` DROP COLUMN `deathTime`");
        await queryRunner.query("ALTER TABLE `characters` DROP COLUMN `state`");
    }

}
