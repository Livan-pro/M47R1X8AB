import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class Location1568761522505 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `locations` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `characters` ADD `locationId` int NULL");
        await queryRunner.query("ALTER TABLE `characters` ADD CONSTRAINT `FK_8aa06b804e5ca26d51eb8147b3c` FOREIGN KEY (`locationId`) REFERENCES `locations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` DROP FOREIGN KEY `FK_8aa06b804e5ca26d51eb8147b3c`");
        await queryRunner.query("ALTER TABLE `characters` DROP COLUMN `locationId`");
        await queryRunner.query("DROP TABLE `locations`");
    }

}
