import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class Implant1568718328110 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `implants` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `characterId` int NULL, `name` varchar(255) NOT NULL, `type` enum ('Limb', 'Brain', 'Internal') NOT NULL, `working` tinyint NOT NULL, `quality` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `implants` ADD CONSTRAINT `FK_08281310bb106a4471c87ebe660` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `implants` DROP FOREIGN KEY `FK_08281310bb106a4471c87ebe660`");
        await queryRunner.query("DROP TABLE `implants`");
    }

}
