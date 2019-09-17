import { Resolver, Query, Subscription, Mutation, Args } from "@nestjs/graphql";
import { Logger, Inject } from "@nestjs/common";
import { ImplantService } from "./implant.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, Implant } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { ImplantCacheService } from "cache/implant-cache.service";
import { UserCacheService } from "cache/user-cache.service";
import { NatsAsyncIterator } from "utils/nats.iterator";
import { Client } from "nats";
import { FullImplantInput } from "graphql.schema";
import { CustomError } from "CustomError";

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
  async implants(@GetUser() user: User) {
    return this.implant.getByCharacterId(user.mainCharacterId);
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
  @Roles(Role.Admin)
  async createImplant(
    @Args("data") data: FullImplantInput,
  ): Promise<number> {
    const implant = await this.implant.create(data);
    return implant.id;
  }

  @Mutation()
  @Roles(Role.Admin)
  async updateImplant(
    @Args("id") id: number,
    @Args("data") data: FullImplantInput,
  ): Promise<boolean> {
    await this.implant.update(id, data);
    return true;
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
