import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class Medicine1568297926709 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `medicines` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` binary(8) NOT NULL, `usedById` int NULL, `usedAt` datetime NULL, UNIQUE INDEX `IDX_c4c9ac38aba0468688754ec203` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `medicines` ADD CONSTRAINT `FK_121b9c18904e2a333e7f8158a94` FOREIGN KEY (`usedById`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `medicines` DROP FOREIGN KEY `FK_121b9c18904e2a333e7f8158a94`");
        await queryRunner.query("DROP INDEX `IDX_c4c9ac38aba0468688754ec203` ON `medicines`");
        await queryRunner.query("DROP TABLE `medicines`");
    }

}
