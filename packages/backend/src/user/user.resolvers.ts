import { Resolver, Mutation, Args, Context, Query } from "@nestjs/graphql";
import { Logger, ValidationPipe, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthService } from "auth/auth.service";
import { CreateUser, CreateCharacter, EditUser, ChangePassword } from "shared/node";
import { ntob } from "number-to-base64";
import { Response } from "express";
import { GqlAuthGuard } from "auth/gql-auth.guard";
import { GetUser } from "./get-user.decorator";
import { User } from "matrix-database";
import { LoginResult } from "graphql.schema";
import { CustomError } from "CustomError";

@Resolver()
// @UseGuards(AuthGuard("jwt"))
export class UserResolvers {
  private readonly log = new Logger(UserResolvers.name);
  constructor(
    private readonly user: UserService,
    private readonly auth: AuthService,
  ) {}

  @Mutation()
  async createUserWithCharacter(
    @Args("user", ValidationPipe) userData: CreateUser,
    @Args("character") characterData: CreateCharacter,
  ): Promise<boolean> {
    try {
      const uData = {...userData, birthday: new Date(0)};
      uData.password = await this.auth.hashPassword(uData.password);
      const cData = {...characterData, age: 0};
      await this.user.createWithCharacter(uData, cData);
      return true;
    } catch (err) {
      if (err.errno === 1062) throw new CustomError("Пользователь с таким email уже зарегистрирован!");
      throw err;
    }
  }

  @Mutation()
  async login(
    @Args("email") email: string,
    @Args("password") password: string,
    @Args("rememberMe") rememberMe: boolean,
    @Context("res") res: Response,
  ): Promise<LoginResult> {
    const user = await this.user.getByEmail(email);
    if (!await this.auth.verifyPassword(password, user.password)) throw new CustomError("Неверный логин или пароль");
    const token = await this.auth.createToken(email, rememberMe);
    res.cookie("token", token.token, { expires: token.expires, httpOnly: true });
    return {
      email: user.email,
      token: token.token,
    };
  }

  @Mutation("logout")
  async logout(@Context("res") res: Response): Promise<boolean> {
    res.clearCookie("token");
    return true;
  }

  @Query("me")
  @UseGuards(GqlAuthGuard)
  async me(@GetUser() user: User): Promise<User> {
    this.log.log(`Me: ${user.email}`);
    return user;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async editUser(
    @Args("user" , new ValidationPipe({
      skipMissingProperties: true,
    })) userData: EditUser,
    @GetUser() user: User,
  ): Promise<boolean> {
    await this.user.update(user.id, userData);
    return true;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @Args("data", ValidationPipe) data: ChangePassword,
    @GetUser() user: User,
  ): Promise<boolean> {
    if (!await this.auth.verifyPassword(data.currentPassword, user.password)) throw new CustomError("Неверный пароль");
    await this.user.update(user.id, {
      password: await this.auth.hashPassword(data.password),
      passwordChangedAt: new Date(),
    });
    return true;
  }
}
