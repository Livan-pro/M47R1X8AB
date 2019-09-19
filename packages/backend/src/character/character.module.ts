import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character, Property } from "matrix-database";
import { CharacterService } from "./character.service";
import { CharacterResolvers } from "./character.resolvers";
import { FileModule } from "file/file.module";
import { CacheModule } from "cache/cache.module";
import { PropertyService } from "./property.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Character, Property]),
    FileModule,
    CacheModule,
  ],
  providers: [CharacterService, CharacterResolvers, PropertyService],
  exports: [CharacterService, PropertyService],
})
export class CharacterModule {}
