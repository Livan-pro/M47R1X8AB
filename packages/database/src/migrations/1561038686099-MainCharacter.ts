import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class MainCharacter1561038686099 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `users` ADD `mainCharacterId` int NULL");
        await queryRunner.query("ALTER TABLE `users` ADD UNIQUE INDEX `IDX_c0f86e0f034553c0fb3633d065` (`mainCharacterId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_c0f86e0f034553c0fb3633d065` ON `users` (`mainCharacterId`)");
        await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `FK_c0f86e0f034553c0fb3633d0653` FOREIGN KEY (`mainCharacterId`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("UPDATE `users` u SET `mainCharacterId` = (SELECT `id` FROM `characters` c WHERE c.`userId` = u.`id` LIMIT 1) WHERE `mainCharacterId` IS NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `FK_c0f86e0f034553c0fb3633d0653`");
        await queryRunner.query("DROP INDEX `REL_c0f86e0f034553c0fb3633d065` ON `users`");
        await queryRunner.query("ALTER TABLE `users` DROP INDEX `IDX_c0f86e0f034553c0fb3633d065`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `mainCharacterId`");
    }

}
