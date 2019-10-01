import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "matrix-database";
import { UserResolvers } from "./user.resolvers";
import { FileModule } from "file/file.module";
import { CharacterModule } from "character/character.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    FileModule,
    CharacterModule,
  ],
  providers: [UserService, UserResolvers],
  exports: [UserService],
})
export class UserModule {}
