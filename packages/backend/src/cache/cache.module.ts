import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Implant, Character, Message } from "matrix-database";
import { UserCacheService } from "./user-cache.service";
import { ImplantCacheService } from "./implant-cache.service";
import { MessageCacheService } from "./message-cache.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Implant, Character, Message]),
  ],
  providers: [UserCacheService, ImplantCacheService, MessageCacheService],
  exports: [UserCacheService, ImplantCacheService, MessageCacheService],
})
export class CacheModule {}
