import { Strategy, JwtFromRequestFunction } from "passport-jwt";
import { AuthService } from "./auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "./jwt-payload.interface";
import { Config } from "config";

const JWTFromCookie: JwtFromRequestFunction = (req) => req && req.cookies && req.cookies.token ? req.cookies.token : null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthService) {
    super({
      jwtFromRequest: JWTFromCookie,
      secretOrKey: Config.get("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.auth.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
