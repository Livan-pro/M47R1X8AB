import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class Init1559669598643 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `email` varchar(255) NOT NULL, `password` char(60) NOT NULL, `passwordChangedAt` datetime NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `birthday` date NOT NULL, `phone` varchar(20) NOT NULL, `vkId` varchar(32) NOT NULL, `medicalInfo` varchar(1000) NULL, UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `characters` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NOT NULL, `name` varchar(255) NOT NULL, `age` int NOT NULL, `quenta` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `characters` ADD CONSTRAINT `FK_7c1bf02092d401b55ecc243ef1f` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` DROP FOREIGN KEY `FK_7c1bf02092d401b55ecc243ef1f`");
        await queryRunner.query("DROP TABLE `characters`");
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
    }

}
