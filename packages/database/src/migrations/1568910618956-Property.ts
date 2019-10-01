import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class Property1568910618956 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `properties` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `characterId` int NULL, `name` varchar(255) NOT NULL, `value` varchar(255) NOT NULL, UNIQUE INDEX `IDX_b3582a7e1d0c4f6b827917d95e` (`characterId`, `name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `properties` ADD CONSTRAINT `FK_3c925d8e07589dea338c3a06504` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `properties` DROP FOREIGN KEY `FK_3c925d8e07589dea338c3a06504`");
        await queryRunner.query("DROP INDEX `IDX_b3582a7e1d0c4f6b827917d95e` ON `properties`");
        await queryRunner.query("DROP TABLE `properties`");
    }

}
