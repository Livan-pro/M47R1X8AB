import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BalanceTransfer } from "matrix-database";
import { BalanceService } from "./balance.service";
import { BalanceResolvers } from "./balance.resolvers";

@Module({
  imports: [
    TypeOrmModule.forFeature([BalanceTransfer]),
  ],
  providers: [BalanceService, BalanceResolvers],
  exports: [BalanceService],
})
export class BalanceModule {}
