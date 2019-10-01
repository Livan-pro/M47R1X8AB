import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BalanceTransfer } from "matrix-database";
import { BalanceService } from "./balance.service";
import { BalanceResolvers } from "./balance.resolvers";
import { CharacterModule } from "character/character.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BalanceTransfer]),
    CharacterModule,
  ],
  providers: [BalanceService, BalanceResolvers],
  exports: [BalanceService],
})
export class BalanceModule {}
