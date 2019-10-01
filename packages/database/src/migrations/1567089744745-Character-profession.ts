import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class CharacterProfession1567089744745 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` ADD `registrationProfession` enum ('None', 'Netrunner', 'Medic', 'Chemist', 'Marshal', 'Hitman', 'Biotechnician', 'Employee', 'Engineer', 'Stalker', 'Mutant') NOT NULL");
        await queryRunner.query("ALTER TABLE `characters` ADD `profession` enum ('None', 'Netrunner', 'Medic', 'Chemist', 'Marshal', 'Hitman', 'Biotechnician', 'Employee', 'Engineer', 'Stalker', 'Mutant') NOT NULL");
        await queryRunner.query("ALTER TABLE `characters` ADD `professionLevel` int NOT NULL DEFAULT 0");
        await queryRunner.query("UPDATE `characters` SET `registrationProfession` = 'Netrunner', `roles` = 0 WHERE `roles` & 1 > 0");
        await queryRunner.query("UPDATE `characters` SET `registrationProfession` = 'Medic', `roles` = 0 WHERE `roles` & 2 > 0");
        await queryRunner.query("UPDATE `characters` SET `registrationProfession` = 'Chemist', `roles` = 0 WHERE `roles` & 4 > 0");
        await queryRunner.query("UPDATE `characters` SET `registrationProfession` = 'Marshal', `roles` = 0 WHERE `roles` & 8 > 0");
        await queryRunner.query("UPDATE `characters` SET `registrationProfession` = 'Hitman', `roles` = 0 WHERE `roles` & 16 > 0");
        await queryRunner.query("UPDATE `characters` SET `registrationProfession` = 'Biotechnician', `roles` = 0 WHERE `roles` & 32 > 0");
        await queryRunner.query("UPDATE `characters` SET `registrationProfession` = 'Employee', `roles` = 0 WHERE `roles` & 64 > 0");
        await queryRunner.query("UPDATE `characters` SET `registrationProfession` = 'Engineer', `roles` = 0 WHERE `roles` & 128 > 0");
        await queryRunner.query("UPDATE `characters` SET `registrationProfession` = 'Stalker', `roles` = 0 WHERE `roles` & 256 > 0");
        await queryRunner.query("UPDATE `characters` SET `registrationProfession` = 'Mutant', `roles` = 0 WHERE `roles` & 512 > 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("UPDATE `characters` SET `roles` = 1 WHERE `registrationProfession` = 'Netrunner'");
        await queryRunner.query("UPDATE `characters` SET `roles` = 2 WHERE `registrationProfession` = 'Medic'");
        await queryRunner.query("UPDATE `characters` SET `roles` = 4 WHERE `registrationProfession` = 'Chemist'");
        await queryRunner.query("UPDATE `characters` SET `roles` = 8 WHERE `registrationProfession` = 'Marshal'");
        await queryRunner.query("UPDATE `characters` SET `roles` = 16 WHERE `registrationProfession` = 'Hitman'");
        await queryRunner.query("UPDATE `characters` SET `roles` = 32 WHERE `registrationProfession` = 'Biotechnician'");
        await queryRunner.query("UPDATE `characters` SET `roles` = 64 WHERE `registrationProfession` = 'Employee'");
        await queryRunner.query("UPDATE `characters` SET `roles` = 128 WHERE `registrationProfession` = 'Engineer'");
        await queryRunner.query("UPDATE `characters` SET `roles` = 256 WHERE `registrationProfession` = 'Stalker'");
        await queryRunner.query("UPDATE `characters` SET `roles` = 512 WHERE `registrationProfession` = 'Mutant'");
        await queryRunner.query("ALTER TABLE `characters` DROP COLUMN `professionLevel`");
        await queryRunner.query("ALTER TABLE `characters` DROP COLUMN `profession`");
        await queryRunner.query("ALTER TABLE `characters` DROP COLUMN `registrationProfession`");
    }

}
