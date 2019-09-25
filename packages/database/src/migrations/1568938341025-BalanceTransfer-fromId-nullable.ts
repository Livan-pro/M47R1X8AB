import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class BalanceTransferFromIdNullable1568938341025 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `balanceHistory` DROP FOREIGN KEY `FK_51a0043e14cde28b1742b538801`");
        await queryRunner.query("ALTER TABLE `balanceHistory` CHANGE `fromId` `fromId` int NULL");
        await queryRunner.query("ALTER TABLE `balanceHistory` ADD CONSTRAINT `FK_51a0043e14cde28b1742b538801` FOREIGN KEY (`fromId`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `balanceHistory` DROP FOREIGN KEY `FK_51a0043e14cde28b1742b538801`");
        await queryRunner.query("ALTER TABLE `balanceHistory` CHANGE `fromId` `fromId` int NOT NULL");
        await queryRunner.query("ALTER TABLE `balanceHistory` ADD CONSTRAINT `FK_51a0043e14cde28b1742b538801` FOREIGN KEY (`fromId`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
