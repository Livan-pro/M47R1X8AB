import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { IJwtPayload } from "./jwt-payload.interface";
import { UserService } from "user/user.service";
import { compare, hash } from "bcryptjs";
import { User } from "matrix-database";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly user: UserService,
  ) {}

  createToken(email: string, rememberMe: boolean): {token: string, expires: Date} {
    const expiresIn = rememberMe ? 2592000 : 3600; // 30 days / 1 hour
    const token = this.jwt.sign({email}, {expiresIn});
    return {
      token,
      expires: new Date(Date.now() + expiresIn * 1000),
    };
  }

  async validateUser(payload: IJwtPayload): Promise<User> {
    try {
      const user = await this.user.getByEmailWithRelations(payload.email, ["mainCharacter", "mainCharacter.location", "mainCharacter.properties"]);
      if (user.passwordChangedAt && (user.passwordChangedAt.getTime() / 1000 > payload.iat)) return null;
      return user;
    } catch (err) {
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, 8);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}
