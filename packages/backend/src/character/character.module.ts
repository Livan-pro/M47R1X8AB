import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character } from "matrix-database";
import { CharacterService } from "./character.service";
import { CharacterResolvers } from "./character.resolvers";

@Module({
  imports: [
    TypeOrmModule.forFeature([Character]),
  ],
  providers: [CharacterService, CharacterResolvers],
  exports: [CharacterService],
})
export class CharacterModule {}
