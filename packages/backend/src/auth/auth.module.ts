import { Module, forwardRef, Global } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { UserModule } from "user/user.module";
import { Config } from "config";

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: Config.get("JWT_SECRET"),
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
