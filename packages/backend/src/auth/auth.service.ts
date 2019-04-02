import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "./jwt-payload.interface";
import { UserService } from "user/user.service";
import { compare, hash } from "bcryptjs";
import { User } from "user/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly user: UserService,
  ) {}

  createToken(email: string, rememberMe: boolean): {token: string, expires: Date} {
    const expiresIn = rememberMe ? 604800 : 3600;
    const token = this.jwt.sign({email}, {expiresIn});
    return {
      token,
      expires: new Date(Date.now() + expiresIn * 1000),
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    try {
      const user = await this.user.getByEmail(payload.email);
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
