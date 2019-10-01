import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { MedicineService } from "./medicine.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, CharacterState, CharacterRole, Medicine, EventType, Character } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { CustomError } from "CustomError";
import { mapCodeToString, codeToString } from "utils";
import { EventService } from "event/event.service";

@Resolver()
@Roles({user: Role.LoggedIn})
export class MedicineResolvers {
  private readonly log = new Logger(MedicineResolvers.name);
  constructor(
    private readonly medicine: MedicineService,
    private readonly event: EventService,
  ) {}

  @Query()
  @Roles({user: Role.Admin})
  async listMedicine() {
    return mapCodeToString(await this.medicine.getAllMedicine());
  }

  @Query()
  @Roles({user: Role.Admin})
  async listMedpack() {
    return mapCodeToString(await this.medicine.getAllMedpack());
  }

  @Mutation()
  @Roles({user: Role.Admin})
  async createMedicine(@Args("code") code: string, @GetUser() user: User): Promise<Medicine> {
    if (code.length !== 16) throw new CustomError("Неверный код!");
    let buf: Buffer;
    try {
      buf = Buffer.from(code, "hex");
    } catch (e) {
      throw new CustomError("Неверный код!");
    }
    try {
      const data = await this.medicine.createMedicine(buf);
      this.event.emit(null, user.id, null, null, EventType.CreateMedicine, data);
      return codeToString(data);
    } catch (err) {
      if (err.code && err.code === "ER_DUP_ENTRY") throw new CustomError("QR-код с таким кодом уже существует");
      throw err;
    }
  }

  @Mutation()
  @Roles({user: Role.Admin})
  async createMedpack(@Args("code") code: string, @GetUser() user: User): Promise<Medicine> {
    if (code.length !== 16) throw new CustomError("Неверный код!");
    let buf: Buffer;
    try {
      buf = Buffer.from(code, "hex");
    } catch (e) {
      throw new CustomError("Неверный код!");
    }
    try {
      const data = await this.medicine.createMedpack(buf);
      this.event.emit(null, user.id, null, null, EventType.CreateMedpack, data);
      return codeToString(data);
    } catch (err) {
      if (err.code && err.code === "ER_DUP_ENTRY") throw new CustomError("QR-код с таким кодом уже существует");
      throw err;
    }
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
      throw new CustomError("Нельзя использовать лекарство без загрязнения!");
    }
    await this.medicine.useMedicine(buf, user.mainCharacterId);
    this.event.emit(user.mainCharacterId, user.id, user.mainCharacterId, user.id, EventType.UseMedicine, {code});
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
      throw new CustomError("Нельзя использовать медпак без тяжёлого ранения!");
    }
    await this.medicine.useMedpack(buf, user.mainCharacterId);
    this.event.emit(user.mainCharacterId, user.id, user.mainCharacterId, user.id, EventType.UseMedpack, {code});
  }

  @Mutation()
  @Roles({ character: CharacterRole.Medic, state: [CharacterState.Normal, CharacterState.Pollution]}, {user: Role.Admin})
  async heal(
    @Args("characterId") characterId: number,
    @GetUser() user: User,
  ): Promise<Partial<Character>> {
    if (characterId === user.mainCharacterId) throw new CustomError("Вы не можете лечить себя!");
    await this.medicine.heal(characterId);
    this.event.emit(user.mainCharacterId, user.id, characterId, null, EventType.Heal);
    return {id: characterId, state: CharacterState.Normal};
  }
}
