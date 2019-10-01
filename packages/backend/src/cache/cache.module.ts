import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Implant } from "matrix-database";
import { UserCacheService } from "./user-cache.service";
import { ImplantCacheService } from "./implant-cache.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Implant]),
  ],
  providers: [UserCacheService, ImplantCacheService],
  exports: [UserCacheService, ImplantCacheService],
})
export class CacheModule {}
