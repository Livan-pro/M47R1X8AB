import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character, Medpack } from "matrix-database";
import { MedpackService } from "./medpack.service";
import { MedpackResolvers } from "./medpack.resolvers";

@Module({
  imports: [
    TypeOrmModule.forFeature([Character, Medpack]),
  ],
  providers: [MedpackService, MedpackResolvers],
  exports: [MedpackService],
})
export class MedpackModule {}
