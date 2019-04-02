import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character } from "./character.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Character]),
  ],
})
export class CharacterModule {}
