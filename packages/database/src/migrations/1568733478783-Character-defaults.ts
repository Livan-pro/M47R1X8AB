import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class CharacterDefaults1568733478783 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` CHANGE `registrationProfession` `registrationProfession` enum ('None', 'Netrunner', 'Medic', 'Chemist', 'Marshal', 'Hitman', 'Biotechnician', 'Employee', 'Engineer', 'Stalker', 'Mutant') NOT NULL DEFAULT 'None'");
        await queryRunner.query("ALTER TABLE `characters` CHANGE `profession` `profession` enum ('None', 'Netrunner', 'Medic', 'Chemist', 'Marshal', 'Hitman', 'Biotechnician', 'Employee', 'Engineer', 'Stalker', 'Mutant') NOT NULL DEFAULT 'None'");
        await queryRunner.query("ALTER TABLE `characters` CHANGE `state` `state` enum ('Normal', 'Pollution', 'SevereWound', 'Death') NOT NULL DEFAULT 'Normal'");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `characters` CHANGE `state` `state` enum ('Normal', 'Pollution', 'SevereWound', 'Death') NOT NULL");
        await queryRunner.query("ALTER TABLE `characters` CHANGE `profession` `profession` enum ('None', 'Netrunner', 'Medic', 'Chemist', 'Marshal', 'Hitman', 'Biotechnician', 'Employee', 'Engineer', 'Stalker', 'Mutant') NOT NULL");
        await queryRunner.query("ALTER TABLE `characters` CHANGE `registrationProfession` `registrationProfession` enum ('None', 'Netrunner', 'Medic', 'Chemist', 'Marshal', 'Hitman', 'Biotechnician', 'Employee', 'Engineer', 'Stalker', 'Mutant') NOT NULL");
    }

}
