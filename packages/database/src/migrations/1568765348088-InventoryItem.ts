import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class InventoryItem1568765348088 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `inventoryItems` (`characterId` int NOT NULL, `itemId` int NOT NULL, `amount` int NOT NULL DEFAULT 0, PRIMARY KEY (`characterId`, `itemId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `inventoryItems` ADD CONSTRAINT `FK_65c38c7a3f3360ff01a48e2e60e` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `inventoryItems` DROP FOREIGN KEY `FK_65c38c7a3f3360ff01a48e2e60e`");
        await queryRunner.query("DROP TABLE `inventoryItems`");
    }

}
