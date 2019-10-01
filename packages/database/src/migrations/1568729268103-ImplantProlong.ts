import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class ImplantProlong1568729268103 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `implantProlongations` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` binary(8) NOT NULL, `time` int NOT NULL, `usedById` int NULL, `usedAt` datetime NULL, UNIQUE INDEX `IDX_0bd54326a1770f23ad31079d3b` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `implantProlongations` ADD CONSTRAINT `FK_5b509eccbdbc4fdaf414ca331f5` FOREIGN KEY (`usedById`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `implantProlongations` DROP FOREIGN KEY `FK_5b509eccbdbc4fdaf414ca331f5`");
        await queryRunner.query("DROP INDEX `IDX_0bd54326a1770f23ad31079d3b` ON `implantProlongations`");
        await queryRunner.query("DROP TABLE `implantProlongations`");
    }

}
