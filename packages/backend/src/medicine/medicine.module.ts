import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character, Medicine } from "matrix-database";
import { MedicineService } from "./Medicine.service";
import { MedicineResolvers } from "./Medicine.resolvers";

@Module({
  imports: [
    TypeOrmModule.forFeature([Character, Medicine]),
  ],
  providers: [MedicineService, MedicineResolvers],
  exports: [MedicineService],
})
export class MedicineModule {}
