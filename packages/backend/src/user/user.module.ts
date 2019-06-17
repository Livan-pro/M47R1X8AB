import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "auth/auth.module";
import { User } from "matrix-database";
import { UserResolvers } from "./user.resolvers";
import { FileModule } from "file/file.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    FileModule,
  ],
  providers: [UserService, UserResolvers],
  exports: [UserService],
})
export class UserModule {}
