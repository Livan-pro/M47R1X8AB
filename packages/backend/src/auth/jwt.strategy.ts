import { Strategy, JwtFromRequestFunction } from "passport-jwt";
import { AuthService } from "./auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { IJwtPayload } from "./jwt-payload.interface";
import { Config } from "config";

const jwtFromCookieOrHeaderOrConnectionParams: JwtFromRequestFunction = req => {
  if (!req) return null;
  if (req.cookies && req.cookies.token) return req.cookies.token;
  if (req.headers && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) return req.headers.authorization.substring(7);
  const rws = req as unknown as {connectionParams: {token?: string}};
  if (rws.connectionParams && typeof rws.connectionParams.token === "string") {
    return rws.connectionParams.token;
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthService) {
    super({
      jwtFromRequest: jwtFromCookieOrHeaderOrConnectionParams,
      secretOrKey: Config.get("JWT_SECRET"),
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.auth.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
