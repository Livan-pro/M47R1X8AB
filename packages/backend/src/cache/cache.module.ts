import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "matrix-database";
import { UserCacheService } from "./user-cache.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserCacheService],
  exports: [UserCacheService],
})
export class CacheModule {}
