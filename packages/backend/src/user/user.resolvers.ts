import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { Logger, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthService } from "auth/auth.service";
import { CreateUser, CreateCharacter } from "shared/node";
import { ntob } from "number-to-base64";

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
      if (err.errno === 1062) throw new Error("Пользователь с таким email уже зарегистрирован!");
      else {
        const code = ntob(Date.now());
        this.log.error(`ERR${code} ${err.stack}`);
        throw new Error(`Возникла ошибка при регистрации. Код ошибки: ${code}. Обратитесь к мастерам!`);
      }
    }
  }
}
