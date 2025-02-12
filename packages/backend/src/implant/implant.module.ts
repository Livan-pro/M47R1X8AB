import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character, Implant, ImplantProlongation } from "matrix-database";
import { ImplantService } from "./implant.service";
import { ImplantResolvers } from "./implant.resolvers";
import { CacheModule } from "cache/cache.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Character, Implant, ImplantProlongation]),
    CacheModule,
  ],
  providers: [ImplantService, ImplantResolvers],
  exports: [ImplantService],
})
export class ImplantModule {}
