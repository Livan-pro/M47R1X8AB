import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Implant, Character } from "matrix-database";
import { UserCacheService } from "./user-cache.service";
import { ImplantCacheService } from "./implant-cache.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Implant, Character]),
  ],
  providers: [UserCacheService, ImplantCacheService],
  exports: [UserCacheService, ImplantCacheService],
})
export class CacheModule {}
