import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class Attachment1566971419262 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `attachments` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `uploaderId` int NOT NULL, `name` varchar(255) NOT NULL, `type` enum ('Image', 'Video', 'Audio') NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `news` ADD `attachmentId` int NULL");
        await queryRunner.query("ALTER TABLE `attachments` ADD CONSTRAINT `FK_b8f8cb9f55776d30ebd6dc779ee` FOREIGN KEY (`uploaderId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `news` ADD CONSTRAINT `FK_11424fead814b21100db914b019` FOREIGN KEY (`attachmentId`) REFERENCES `attachments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `news` DROP FOREIGN KEY `FK_11424fead814b21100db914b019`");
        await queryRunner.query("ALTER TABLE `attachments` DROP FOREIGN KEY `FK_b8f8cb9f55776d30ebd6dc779ee`");
        await queryRunner.query("ALTER TABLE `news` DROP COLUMN `attachmentId`");
        await queryRunner.query("DROP TABLE `attachments`");
    }

}
