import { Resolver, Query, Subscription, Mutation, Args } from "@nestjs/graphql";
import { Logger, Inject } from "@nestjs/common";
import { ImplantService } from "./implant.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, Implant, CharacterRole, ImplantProlongation, Profession } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { ImplantCacheService } from "cache/implant-cache.service";
import { UserCacheService } from "cache/user-cache.service";
import { NatsAsyncIterator } from "utils/nats.iterator";
import { Client } from "nats";
import { FullImplantInput } from "graphql.schema";
import { CustomError } from "CustomError";
import { mapCodeToString, codeToString } from "utils";

@Resolver()
@Roles(Role.LoggedIn)
export class ImplantResolvers {
  private readonly log = new Logger(ImplantResolvers.name);
  constructor(
    private readonly implant: ImplantService,
    private readonly iCache: ImplantCacheService,
    private readonly uCache: UserCacheService,
    @Inject("NATS")
    private readonly nats: Client,
  ) {}

  @Query()
  @Roles(Role.Admin)
  async listImplantProlongation() {
    return mapCodeToString(await this.implant.getAllImplantProlongations());
  }

  @Mutation()
  @Roles(Role.Admin)
  async createImplantProlongation(@Args("code") code: string, @Args("time") time: number): Promise<ImplantProlongation> {
    if (code.length !== 16) throw new CustomError("Неверный код!");
    let buf: Buffer;
    try {
      buf = Buffer.from(code, "hex");
    } catch (e) {
      throw new CustomError("Неверный код!");
    }
    try {
      return codeToString(await this.implant.createImplantProlongation(buf, time));
    } catch (err) {
      if (err.code && err.code === "ER_DUP_ENTRY") throw new CustomError("QR-код с таким кодом уже существует");
      throw err;
    }
  }

  @Query()
  async implants(
    @Args("id") id: number,
    @GetUser() user: User,
  ) {
    if (id) {
      if (!user.roles.has(Role.Admin) && user.mainCharacter.profession !== Profession.Biotechnician) {
        throw new CustomError("У вас нет доступа к имплантам этого персонажа!");
      }
      return this.implant.getByCharacterId(id);
    } else return this.implant.getByCharacterId(user.mainCharacterId);
  }

  @Mutation()
  async prolongImplants(
    @Args("code") code: string,
    @GetUser() user: User,
  ): Promise<void> {
    if (code.length !== 16) throw new CustomError("Неверный код продления имплантов!");
    let buf: Buffer;
    try {
      buf = Buffer.from(code, "hex");
    } catch (e) {
      throw new CustomError("Неверный код продления имплантов!");
    }
    await this.implant.useProlongation(buf, user.mainCharacterId);
  }

  @Mutation()
  @Roles([Role.Admin], [Profession.Biotechnician])
  async createImplant(
    @Args("data") data: FullImplantInput,
    @GetUser() user: User,
  ): Promise<Implant> {
    if (data.characterId === user.mainCharacterId && !user.roles.has(Role.Admin)) throw new CustomError("Вы не можете добавить имплант себе!");
    if (!user.roles.has(Role.Admin) || !Object.prototype.hasOwnProperty.call(data, "working")) data.working = true;
    if (!user.roles.has(Role.Admin) || !Object.prototype.hasOwnProperty.call(data, "quality")) data.quality = false;
    return await this.implant.create(data);
  }

  @Mutation()
  @Roles(Role.Admin)
  async updateImplant(
    @Args("id") id: number,
    @Args("data") data: FullImplantInput,
  ): Promise<Partial<Implant>> {
    return await this.implant.update(id, data);
  }

  @Mutation()
  @Roles([Profession.Biotechnician], [Role.Admin])
  async fixImplants(
    @Args("characterId") characterId: number,
    @GetUser() user: User,
  ): Promise<void> {
    if (characterId === user.mainCharacterId) throw new CustomError("Вы не можете чинить свои импланты!");
    await this.implant.fix(user.mainCharacterId, characterId);
  }

  @Subscription("implants", {
    filter(this: ImplantResolvers, payload: {implant: Partial<Implant>}, _, ctx: {req: {user: User}}) {
      return this.iCache.getCharacterId(payload.implant.id) === this.uCache.getMainCharacterId(ctx.req.user.id);
    },
    resolve: data => {
      const {id, ...filtered} = data.implant;
      return {...filtered, _id: id};
    },
  })
  sMainCharacter() {
    return new NatsAsyncIterator(this.nats, "*.implant.update", "implant");
  }
}
