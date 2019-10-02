import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class MoreEventTypes1570051762848 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `events` CHANGE `type` `type` enum ('AddBalance', 'AddItem', 'ChangePassword', 'ConsumeItem', 'CreateImplant', 'CreateImplantProlongation', 'CreateItemGift', 'CreateLocation', 'CreateMedicine', 'CreateMedpack', 'CreateNews', 'CreateUserWithCharacter', 'DeathBySevereWound', 'DeleteNews', 'EditCharacter', 'EditProperty', 'EditUser', 'FixImplants', 'Heal', 'Login', 'Logout', 'GetPollutionByHomeless', 'GetSevereWoundByPollution', 'ProlongImplants', 'RejectImplants', 'SetFirebaseToken', 'SetMainCharacter', 'SetUserRole', 'Suicide', 'TransferItem', 'TransferMoney', 'UnsetFirebaseToken', 'UpdateCharacter', 'UpdateImplant', 'UpdateLocation', 'UpdateNews', 'UpdateUser', 'UploadAttachment', 'UploadAvatar', 'UseItemGift', 'UseMedicine', 'UseMedpack') NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `events` CHANGE `type` `type` enum ('AddBalance', 'AddItem', 'ChangePassword', 'ConsumeItem', 'CreateImplant', 'CreateImplantProlongation', 'CreateItemGift', 'CreateLocation', 'CreateMedicine', 'CreateMedpack', 'CreateNews', 'CreateUserWithCharacter', 'DeleteNews', 'EditCharacter', 'EditProperty', 'EditUser', 'FixImplants', 'Heal', 'Login', 'Logout', 'ProlongImplants', 'SetFirebaseToken', 'SetMainCharacter', 'SetUserRole', 'Suicide', 'TransferItem', 'TransferMoney', 'UnsetFirebaseToken', 'UpdateCharacter', 'UpdateImplant', 'UpdateLocation', 'UpdateNews', 'UpdateUser', 'UploadAttachment', 'UploadAvatar', 'UseItemGift', 'UseMedicine', 'UseMedpack') NOT NULL");
    }

}
