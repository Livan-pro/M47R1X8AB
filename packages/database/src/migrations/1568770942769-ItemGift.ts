import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class ItemGift1568770942769 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `itemGifts` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` binary(8) NOT NULL, `usedById` int NULL, `usedAt` datetime NULL, `itemId` int NOT NULL, `amount` int NOT NULL DEFAULT 1, UNIQUE INDEX `IDX_acbcdb98ceb3c20bd3caeb34f7` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `itemGifts` ADD CONSTRAINT `FK_1811eeb977fc6d98e7c3cf090b1` FOREIGN KEY (`usedById`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `itemGifts` DROP FOREIGN KEY `FK_1811eeb977fc6d98e7c3cf090b1`");
        await queryRunner.query("DROP INDEX `IDX_acbcdb98ceb3c20bd3caeb34f7` ON `itemGifts`");
        await queryRunner.query("DROP TABLE `itemGifts`");
    }

}
