import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { Logger, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthService } from "auth/auth.service";
import { CreateUser, CreateCharacter } from "shared/node";

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
    userData.password = await this.auth.hashPassword(userData.password);
    await this.user.createWithCharacter(userData, characterData as any);
    return true;
  }
}
