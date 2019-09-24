import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { MedicineService } from "./medicine.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, CharacterState, CharacterRole } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { CustomError } from "CustomError";
import { mapCodeToString } from "utils";

@Resolver()
@Roles(Role.LoggedIn)
export class MedicineResolvers {
  private readonly log = new Logger(MedicineResolvers.name);
  constructor(
    private readonly medicine: MedicineService,
  ) {}

  @Query()
  @Roles(Role.Admin)
  async listMedicine() {
    return mapCodeToString(await this.medicine.getAllMedicine());
  }

  @Query()
  @Roles(Role.Admin)
  async listMedpack() {
    return mapCodeToString(await this.medicine.getAllMedpack());
  }

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

  @Mutation()
  @Roles([CharacterRole.Medic], [Role.Admin])
  async heal(
    @Args("characterId") characterId: number,
    @GetUser() user: User,
  ): Promise<void> {
    if (characterId === user.mainCharacterId) throw new CustomError("Вы не можете лечить себя!");
    await this.medicine.heal(characterId);
  }
}
