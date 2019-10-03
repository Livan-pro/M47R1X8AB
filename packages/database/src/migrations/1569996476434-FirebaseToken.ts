import {MigrationInterface, QueryRunner} from "typeorm";
// tslint:disable
export class FirebaseToken1569996476434 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `firebaseTokens` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `token` varchar(255) NOT NULL, `userId` int NULL, UNIQUE INDEX `IDX_319ee4921f654058deb8ed00ff` (`token`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `events` CHANGE `type` `type` enum ('AddBalance', 'AddItem', 'ChangePassword', 'ConsumeItem', 'CreateImplant', 'CreateImplantProlongation', 'CreateItemGift', 'CreateLocation', 'CreateMedicine', 'CreateMedpack', 'CreateNews', 'CreateUserWithCharacter', 'DeleteNews', 'EditCharacter', 'EditProperty', 'EditUser', 'FixImplants', 'Heal', 'Login', 'Logout', 'ProlongImplants', 'SetFirebaseToken', 'SetMainCharacter', 'SetUserRole', 'Suicide', 'TransferItem', 'TransferMoney', 'UnsetFirebaseToken', 'UpdateCharacter', 'UpdateImplant', 'UpdateLocation', 'UpdateNews', 'UpdateUser', 'UploadAttachment', 'UploadAvatar', 'UseItemGift', 'UseMedicine', 'UseMedpack') NOT NULL");
        await queryRunner.query("ALTER TABLE `firebaseTokens` ADD CONSTRAINT `FK_10ffaee7ee5e0bab66f1c0d1c9c` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `firebaseTokens` DROP FOREIGN KEY `FK_10ffaee7ee5e0bab66f1c0d1c9c`");
        await queryRunner.query("ALTER TABLE `events` CHANGE `type` `type` enum ('AddBalance', 'AddItem', 'ChangePassword', 'ConsumeItem', 'CreateImplant', 'CreateImplantProlongation', 'CreateItemGift', 'CreateLocation', 'CreateMedicine', 'CreateMedpack', 'CreateNews', 'CreateUserWithCharacter', 'DeleteNews', 'EditCharacter', 'EditProperty', 'EditUser', 'FixImplants', 'Heal', 'Login', 'Logout', 'ProlongImplants', 'SetMainCharacter', 'SetUserRole', 'Suicide', 'TransferItem', 'TransferMoney', 'UpdateCharacter', 'UpdateImplant', 'UpdateLocation', 'UpdateNews', 'UpdateUser', 'UploadAttachment', 'UploadAvatar', 'UseItemGift', 'UseMedicine', 'UseMedpack') NOT NULL");
        await queryRunner.query("DROP INDEX `IDX_319ee4921f654058deb8ed00ff` ON `firebaseTokens`");
        await queryRunner.query("DROP TABLE `firebaseTokens`");
    }

}
