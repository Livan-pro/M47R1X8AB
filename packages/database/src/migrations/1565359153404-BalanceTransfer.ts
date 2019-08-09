import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class BalanceTransfer1565359153404 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `balanceHistory` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `fromId` int NOT NULL, `toId` int NOT NULL, `amount` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `balanceHistory` ADD CONSTRAINT `FK_51a0043e14cde28b1742b538801` FOREIGN KEY (`fromId`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `balanceHistory` ADD CONSTRAINT `FK_098fa512ae471991ea187a33a1e` FOREIGN KEY (`toId`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `balanceHistory` DROP FOREIGN KEY `FK_098fa512ae471991ea187a33a1e`");
        await queryRunner.query("ALTER TABLE `balanceHistory` DROP FOREIGN KEY `FK_51a0043e14cde28b1742b538801`");
        await queryRunner.query("DROP TABLE `balanceHistory`");
    }

}
