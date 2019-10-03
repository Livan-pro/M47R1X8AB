import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class Message1570101094602 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `messages` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `fromId` int NOT NULL, `toId` int NOT NULL, `text` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `events` CHANGE `type` `type` enum ('AddBalance', 'AddItem', 'ChangePassword', 'ConsumeItem', 'CreateImplant', 'CreateImplantProlongation', 'CreateItemGift', 'CreateLocation', 'CreateMedicine', 'CreateMedpack', 'CreateNews', 'CreateUserWithCharacter', 'DeathBySevereWound', 'DeleteNews', 'EditCharacter', 'EditProperty', 'EditUser', 'FixImplants', 'Heal', 'Login', 'Logout', 'NewMessage', 'GetPollutionByHomeless', 'GetSevereWoundByPollution', 'ProlongImplants', 'RejectImplants', 'SetFirebaseToken', 'SetMainCharacter', 'SetUserRole', 'Suicide', 'TransferItem', 'TransferMoney', 'UnsetFirebaseToken', 'UpdateCharacter', 'UpdateImplant', 'UpdateLocation', 'UpdateNews', 'UpdateUser', 'UploadAttachment', 'UploadAvatar', 'UseItemGift', 'UseMedicine', 'UseMedpack') NOT NULL");
        await queryRunner.query("ALTER TABLE `messages` ADD CONSTRAINT `FK_627bdb88ff88b446023474e4261` FOREIGN KEY (`fromId`) REFERENCES `characters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `messages` DROP FOREIGN KEY `FK_627bdb88ff88b446023474e4261`");
        await queryRunner.query("ALTER TABLE `events` CHANGE `type` `type` enum ('AddBalance', 'AddItem', 'ChangePassword', 'ConsumeItem', 'CreateImplant', 'CreateImplantProlongation', 'CreateItemGift', 'CreateLocation', 'CreateMedicine', 'CreateMedpack', 'CreateNews', 'CreateUserWithCharacter', 'DeathBySevereWound', 'DeleteNews', 'EditCharacter', 'EditProperty', 'EditUser', 'FixImplants', 'Heal', 'Login', 'Logout', 'GetPollutionByHomeless', 'GetSevereWoundByPollution', 'ProlongImplants', 'RejectImplants', 'SetFirebaseToken', 'SetMainCharacter', 'SetUserRole', 'Suicide', 'TransferItem', 'TransferMoney', 'UnsetFirebaseToken', 'UpdateCharacter', 'UpdateImplant', 'UpdateLocation', 'UpdateNews', 'UpdateUser', 'UploadAttachment', 'UploadAvatar', 'UseItemGift', 'UseMedicine', 'UseMedpack') NOT NULL");
        await queryRunner.query("DROP TABLE `messages`");
    }

}
