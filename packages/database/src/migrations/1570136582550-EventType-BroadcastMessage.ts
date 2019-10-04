import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class EventTypeBroadcastMessage1570136582550 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `events` CHANGE `type` `type` enum ('AddBalance', 'AddItem', 'BroadcastMessage', 'ChangePassword', 'ConsumeItem', 'CreateImplant', 'CreateImplantProlongation', 'CreateItemGift', 'CreateLocation', 'CreateMedicine', 'CreateMedpack', 'CreateNews', 'CreateUserWithCharacter', 'DeathBySevereWound', 'DeleteNews', 'EditCharacter', 'EditProperty', 'EditUser', 'FixImplants', 'Heal', 'Login', 'Logout', 'NewMessage', 'GetPollutionByHomeless', 'GetSevereWoundByPollution', 'ProlongImplants', 'RejectImplants', 'SetFirebaseToken', 'SetMainCharacter', 'SetUserRole', 'Suicide', 'TransferItem', 'TransferMoney', 'UnsetFirebaseToken', 'UpdateCharacter', 'UpdateImplant', 'UpdateLocation', 'UpdateNews', 'UpdateUser', 'UploadAttachment', 'UploadAvatar', 'UseItemGift', 'UseMedicine', 'UseMedpack') NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `events` CHANGE `type` `type` enum ('AddBalance', 'AddItem', 'ChangePassword', 'ConsumeItem', 'CreateImplant', 'CreateImplantProlongation', 'CreateItemGift', 'CreateLocation', 'CreateMedicine', 'CreateMedpack', 'CreateNews', 'CreateUserWithCharacter', 'DeathBySevereWound', 'DeleteNews', 'EditCharacter', 'EditProperty', 'EditUser', 'FixImplants', 'Heal', 'Login', 'Logout', 'NewMessage', 'GetPollutionByHomeless', 'GetSevereWoundByPollution', 'ProlongImplants', 'RejectImplants', 'SetFirebaseToken', 'SetMainCharacter', 'SetUserRole', 'Suicide', 'TransferItem', 'TransferMoney', 'UnsetFirebaseToken', 'UpdateCharacter', 'UpdateImplant', 'UpdateLocation', 'UpdateNews', 'UpdateUser', 'UploadAttachment', 'UploadAvatar', 'UseItemGift', 'UseMedicine', 'UseMedpack') NOT NULL");
    }

}
