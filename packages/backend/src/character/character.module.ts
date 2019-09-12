import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character } from "matrix-database";
import { CharacterService } from "./character.service";
import { CharacterResolvers } from "./character.resolvers";
import { FileModule } from "file/file.module";
import { CacheModule } from "cache/cache.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Character]),
    FileModule,
    CacheModule,
  ],
  providers: [CharacterService, CharacterResolvers],
  exports: [CharacterService],
})
export class CharacterModule {}
