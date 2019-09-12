import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class Medpack1568287885949 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `medpacks` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` binary(8) NOT NULL, `usedById` int NULL, `usedAt` datetime NULL, UNIQUE INDEX `IDX_a22da12148bbc5d72247832b1b` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `medpacks` ADD CONSTRAINT `FK_4551cb4e48b29f3db0aae5010b6` FOREIGN KEY (`usedById`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `medpacks` DROP FOREIGN KEY `FK_4551cb4e48b29f3db0aae5010b6`");
        await queryRunner.query("DROP INDEX `IDX_a22da12148bbc5d72247832b1b` ON `medpacks`");
        await queryRunner.query("DROP TABLE `medpacks`");
    }

}
