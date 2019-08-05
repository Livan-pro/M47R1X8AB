import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class CharacterAvatarUploadedAt1563117621439 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` ADD `avatarUploadedAt` datetime NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` DROP COLUMN `avatarUploadedAt`");
    }

}
