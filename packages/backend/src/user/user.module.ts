import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "auth/auth.module";
import { User } from "./user.entity";
import { CharacterModule } from "character/character.module";
import { UserResolvers } from "./user.resolvers";
import { FileModule } from "file/file.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    FileModule,
  ],
  providers: [UserService, UserResolvers],
  exports: [UserService],
})
export class UserModule {}
