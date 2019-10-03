import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "matrix-database";
import { MessageService } from "./message.service";
import { MessageResolvers } from "./message.resolvers";
import { CacheModule } from "cache/cache.module";
import { CharacterModule } from "character/character.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    CacheModule,
    CharacterModule,
  ],
  providers: [MessageService, MessageResolvers],
  exports: [MessageService],
})
export class MessageModule {}
