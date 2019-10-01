import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class CharacterImplantsRejectTime1568718512590 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` ADD `implantsRejectTime` datetime NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` DROP COLUMN `implantsRejectTime`");
    }

}
