import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { MedpackService } from "./medpack.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, CharacterState } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { CustomError } from "CustomError";

@Resolver()
@Roles(Role.LoggedIn)
export class MedpackResolvers {
  private readonly log = new Logger(MedpackResolvers.name);
  constructor(
    private readonly medpack: MedpackService,
  ) {}

  @Mutation()
  async useMedpack(
    @Args("code") code: string,
    @GetUser() user: User,
  ): Promise<void> {
    if (code.length !== 16) throw new CustomError("Неверный код медпака!");
    let buf: Buffer;
    try {
      buf = Buffer.from(code, "hex");
    } catch (e) {
      throw new CustomError("Неверный код медпака!");
    }
    if (user.mainCharacter.state !== CharacterState.Pollution && user.mainCharacter.state !== CharacterState.SevereWound) {
      throw new CustomError("Вам не требуется медпак!");
    }
    await this.medpack.use(buf, user.mainCharacterId);
  }
}
