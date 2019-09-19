import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { MedicineService } from "./medicine.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, CharacterState } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { CustomError } from "CustomError";

@Resolver()
@Roles(Role.LoggedIn)
export class MedicineResolvers {
  private readonly log = new Logger(MedicineResolvers.name);
  constructor(
    private readonly medicine: MedicineService,
  ) {}

  @Mutation()
  async useMedicine(
    @Args("code") code: string,
    @GetUser() user: User,
  ): Promise<void> {
    if (code.length !== 16) throw new CustomError("Неверный код лекарства!");
    let buf: Buffer;
    try {
      buf = Buffer.from(code, "hex");
    } catch (e) {
      throw new CustomError("Неверный код лекарства!");
    }
    if (user.mainCharacter.state !== CharacterState.Pollution) {
      throw new CustomError("Вам не требуется лекарство!");
    }
    await this.medicine.useMedicine(buf, user.mainCharacterId);
  }

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
    await this.medicine.useMedpack(buf, user.mainCharacterId);
  }
  }
}
