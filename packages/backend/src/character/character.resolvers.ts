import { Resolver, Mutation, Args, Query, Parent, ResolveProperty } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { CharacterService } from "./character.service";
import { CreateCharacter } from "shared/node";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, Character, CharacterState, CharacterRole, Roles as RolesClass } from "matrix-database";
import { FileService } from "file/file.service";
import * as imageSizeSync from "image-size";
import { CustomError } from "CustomError";
import { Roles } from "auth/roles.decorator";
import { FullCharacterInput } from "graphql.schema";
import { States } from "auth/states.decorator";

@Resolver("Character")
@Roles(Role.LoggedIn)
export class CharacterResolvers {
  private readonly log = new Logger(CharacterResolvers.name);
  constructor(
    private readonly character: CharacterService,
    private readonly file: FileService,
  ) {}

  @ResolveProperty()
  own(@Parent() character, @GetUser() user) {
    return character.userId === user.id;
  }

  @Query()
  @States(CharacterState.Normal, CharacterState.Pollution)
  async characters(@GetUser() user: User): Promise<Character[]> {
    const fields: Array<keyof Character> = ["id", "name", "avatarUploadedAt", "profession"];
    if (user.roles.has(Role.Admin)) fields.push("quenta", "roles");
    return await this.character.getAll(fields);
  }

  @Query("character")
  @States(CharacterState.Normal, CharacterState.Pollution)
  async getCharacter(@GetUser() user: User, @Args("id") id: number): Promise<Character | undefined> {
    const fields: Array<keyof Character> = ["id", "name", "avatarUploadedAt", "profession"];
    if (user.roles.has(Role.Admin)) fields.push("quenta", "roles");
    return await this.character.findById(id);
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
  @States(CharacterState.Normal, CharacterState.Pollution)
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
    if (user.mainCharacter.state === CharacterState.Death) return user.mainCharacter.deathTime;
    const deathTime = new Date();
    await this.character.update(user.mainCharacter.id, {state: CharacterState.Death, deathTime});
    return deathTime;
  }

  @Mutation()
  @Roles(Role.Admin)
  async updateCharacter(
    @Args("id") id: number,
    @Args("data") data: FullCharacterInput,
  ): Promise<boolean> {
    await this.character.update(id, "roles" in data ? {
      ...data,
      roles: new RolesClass<typeof CharacterRole>(data.roles, CharacterRole),
    } : {...data} as unknown as Partial<Character>);
    return true;
  }
}
