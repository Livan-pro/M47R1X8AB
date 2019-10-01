import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class Event1569971920168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `events` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `causedByCharacterId` int NULL, `causedByUserId` int NULL, `affectedCharacterId` int NULL, `affectedUserId` int NULL, `type` enum ('AddBalance', 'AddItem', 'ChangePassword', 'ConsumeItem', 'CreateImplant', 'CreateImplantProlongation', 'CreateItemGift', 'CreateLocation', 'CreateMedicine', 'CreateMedpack', 'CreateNews', 'CreateUserWithCharacter', 'DeleteNews', 'EditCharacter', 'EditProperty', 'EditUser', 'FixImplants', 'Heal', 'Login', 'Logout', 'ProlongImplants', 'SetMainCharacter', 'SetUserRole', 'Suicide', 'TransferItem', 'TransferMoney', 'UpdateCharacter', 'UpdateImplant', 'UpdateLocation', 'UpdateNews', 'UpdateUser', 'UploadAttachment', 'UploadAvatar', 'UseItemGift', 'UseMedicine', 'UseMedpack') NOT NULL, `data` json NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `events` ADD CONSTRAINT `FK_f65519c02659ec2a3e76ca46308` FOREIGN KEY (`causedByCharacterId`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `events` ADD CONSTRAINT `FK_af4931cb59ab8cf87142c9cd0b8` FOREIGN KEY (`causedByUserId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `events` ADD CONSTRAINT `FK_e544e08ccde23880e4121b1ed75` FOREIGN KEY (`affectedCharacterId`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `events` ADD CONSTRAINT `FK_d104512b7bc2b1f1a551e3bc4a5` FOREIGN KEY (`affectedUserId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `events` DROP FOREIGN KEY `FK_d104512b7bc2b1f1a551e3bc4a5`");
        await queryRunner.query("ALTER TABLE `events` DROP FOREIGN KEY `FK_e544e08ccde23880e4121b1ed75`");
        await queryRunner.query("ALTER TABLE `events` DROP FOREIGN KEY `FK_af4931cb59ab8cf87142c9cd0b8`");
        await queryRunner.query("ALTER TABLE `events` DROP FOREIGN KEY `FK_f65519c02659ec2a3e76ca46308`");
        await queryRunner.query("DROP TABLE `events`");
    }

}
