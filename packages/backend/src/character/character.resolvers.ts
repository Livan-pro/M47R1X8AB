import { Resolver, Mutation, Args, Query, Parent, ResolveProperty, Subscription } from "@nestjs/graphql";
import { Logger, Inject, ForbiddenException } from "@nestjs/common";
import { CharacterService } from "./character.service";
import { CreateCharacter } from "shared/node";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, Character, CharacterState, CharacterRole, Roles as RolesClass, Profession, Property } from "matrix-database";
import { FileService } from "file/file.service";
import * as imageSizeSync from "image-size";
import { CustomError } from "CustomError";
import { Roles } from "auth/roles.decorator";
import { FullCharacterInput } from "graphql.schema";
import { NatsAsyncIterator } from "utils/nats.iterator";
import { Client } from "nats";
import { UserCacheService } from "cache/user-cache.service";
import { PropertyService } from "./property.service";
import { LocationService } from "location/location.service";
import { Config } from "config";

@Resolver("Character")
@Roles({user: Role.LoggedIn})
export class CharacterResolvers {
  private readonly log = new Logger(CharacterResolvers.name);
  private readonly suicideEnabled = Config.getBoolean("SUICIDE_ENABLED", false);
  constructor(
    private readonly character: CharacterService,
    private readonly file: FileService,
    private readonly uCache: UserCacheService,
    private readonly property: PropertyService,
    private readonly location: LocationService,
    @Inject("NATS")
    private readonly nats: Client,
  ) {}

  @ResolveProperty()
  own(@Parent() character, @GetUser() user) {
    return character.userId === user.id;
  }

  @Query()
  @Roles({user: Role.Admin}, {state: [CharacterState.Normal, CharacterState.Pollution]})
  async characters(@GetUser() user: User): Promise<Character[]> {
    const fields: Array<keyof Character> = ["id", "userId", "name", "avatarUploadedAt", "profession", "professionLevel"];
    const relations = ["location"];
    if (user.roles.has(Role.Admin)) {
      fields.push("quenta", "roles", "registrationProfession", "balance", "state", "pollution", "deathTime", "implantsRejectTime");
    }
    const chars = await this.character.getAll(fields, relations);
    if (!user.roles.has(Role.Admin)) {
      chars.map(c => {
        if (c.userId !== user.id) {
          c.location = null;
          c.professionLevel = null;
        }
        c.userId = null;
        return c;
      });
    }

    return chars;
  }

  @Query("character")
  async getCharacter(@GetUser() user: User, @Args("id") id: number): Promise<Character | undefined> {
    const fields: Array<keyof Character> = ["id", "userId", "name", "avatarUploadedAt", "profession", "professionLevel", "location", "state"];
    if (user.roles.has(Role.Admin)) fields.push("quenta", "roles");
    if (user.roles.has(Role.Admin) || user.mainCharacter.roles.has(CharacterRole.Medic) || id === user.mainCharacterId) {
      fields.push("implantsRejectTime", "pollution");
    }
    const char = await this.character.findById(id, fields, ["location", "properties"]);
    if (!char) return null;
    if (
      !user.roles.has(Role.Admin) &&
      [CharacterState.SevereWound, CharacterState.Death].includes(user.mainCharacter.state) &&
      char.userId !== user.id
    ) return null;
    if (char.userId !== user.id && !user.roles.has(Role.Admin)) {
      char.location = null;
      char.professionLevel = null;
    }
    if (
      char.state === CharacterState.Pollution &&
      char.userId !== user.mainCharacterId &&
      !user.roles.has(Role.Admin) &&
      !user.mainCharacter.roles.has(CharacterRole.Medic)
    ) char.state = CharacterState.Normal;
    if (!user.roles.has(Role.Admin)) char.userId = null;
    return char;
  }

  @Mutation()
  async editCharacter(
    @Args("id") id: number,
    @Args("character") data: CreateCharacter,
    @GetUser() user: User,
  ): Promise<boolean> {
    if (user.mainCharacterId !== id && !user.roles.has(Role.Admin)) await this.character.getByIdAndOwner(id, user.id);
    await this.character.update(id, data);
    return true;
  }

  @Mutation()
  @Roles({state: [CharacterState.Normal, CharacterState.Pollution]})
  async uploadAvatar(
    @Args("id") id: number,
    @Args("avatar") avatar: string,
    @GetUser() user: User,
  ): Promise<Date> {
    if (user.mainCharacterId !== id) await this.character.getByIdAndOwner(id, user.id);
    if (avatar.length > 666 * 1024 /* 😈, ~= 500KB */ ) throw new CustomError("Слишком большой размер файла");
    const buffer = Buffer.from(avatar, "base64");
    const img = imageSizeSync(buffer);
    if (img.type !== "png") throw new Error(`Not a png: ${img.type}`);
    if (img.width > 200 || img.height > 200) throw new Error(`Image size bigger than 200x200: ${img.width}x${img.height}`);
    if (img.width < 50 || img.height < 50) throw new CustomError(`Слишком маленькое изображение: ${img.width}x${img.height}`);
    if (user.mainCharacterId !== id) await this.character.getByIdAndOwner(id, user.id);
    const time = Math.floor(Date.now() / 1000);
    const date = new Date(time * 1000);
    await this.file.uploadFromBuffer(buffer, ["avatar", id.toString() + "_" + time + ".png"]);
    await this.character.update(id, {avatarUploadedAt: date});
    return date;
  }

  @Mutation()
  async suicide(
    @GetUser() user: User,
  ): Promise<Date> {
    if (!this.suicideEnabled) throw new CustomError("Суицид временно отключён!");
    if (user.mainCharacter.state === CharacterState.Death) return user.mainCharacter.deathTime;
    const deathTime = new Date();
    await this.character.update(user.mainCharacter.id, {state: CharacterState.Death, deathTime});
    return deathTime;
  }

  @Mutation()
  @Roles({user: Role.Admin})
  async updateCharacter(
    @Args("id") id: number,
    @Args("data") data: FullCharacterInput,
  ): Promise<Partial<Character>> {
    if (data.locationId < 0) {
      data.locationId = null;
    }
    const update = await this.character.update(id, "roles" in data ? {
      ...data,
      roles: new RolesClass<typeof CharacterRole>(data.roles, CharacterRole),
    } : {...data} as unknown as Partial<Character>);
    if (update.locationId && !update.location) {
      update.location = await this.location.getById(update.locationId);
    }
    return update;
  }

  @Mutation()
  @Roles({user: Role.Admin}, {profession: Profession.Marshal, state: [CharacterState.Normal, CharacterState.Pollution]})
  async editProperty(
    @Args("characterId") characterId: number,
    @Args("name") name: string,
    @Args("value") value: string,
    @GetUser() user: User,
  ): Promise<boolean> {
    if (value && value.length) await this.property.createOrUpdate(characterId, name, value);
    else await this.property.delete(characterId, name);
    return true;
  }

  @Subscription("mainCharacter", {
    filter(this: CharacterResolvers, payload: {mainCharacter: Partial<Character>}, _, ctx: {req: {user: User}}) {
      return payload.mainCharacter.id === this.uCache.getMainCharacterId(ctx.req.user.id);
    },
    resolve: data => {
      const {id, ...filtered} = data.mainCharacter;
      if (filtered.deathTime) filtered.deathTime = new Date(filtered.deathTime);
      if (filtered.pollutionStartTime) filtered.pollutionStartTime = new Date(filtered.pollutionStartTime);
      if (filtered.implantsRejectTime) filtered.implantsRejectTime = new Date(filtered.implantsRejectTime);
      return filtered;
    },
  })
  sMainCharacter(@GetUser() user: User) {
    this.log.log(`subscribe ${user.id} ${user.mainCharacterId}`);
    return new NatsAsyncIterator(this.nats, "*.character.update", "mainCharacter");
  }
}
