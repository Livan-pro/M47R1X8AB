import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { Logger, UseGuards } from "@nestjs/common";
import { CharacterService } from "./character.service";
import { CreateCharacter } from "shared/node";
import { ntob } from "number-to-base64";
import { GqlAuthGuard } from "auth/gql-auth.guard";
import { GetUser } from "user/get-user.decorator";
import { User } from "matrix-database";
import { Character } from "graphql.schema";
import { FileService } from "file/file.service";
import * as imageSizeSync from "image-size";

@Resolver()
@UseGuards(GqlAuthGuard)
export class CharacterResolvers {
  private readonly log = new Logger(CharacterResolvers.name);
  constructor(
    private readonly character: CharacterService,
    private readonly file: FileService,
  ) {}

  @Query()
  async characters(@GetUser() user: User): Promise<Character[]> {
    return (await this.character.getAll()).map(c => ({...c, own: c.userId === user.id}));
  }

  @Query("character")
  async getCharacter(@GetUser() user: User, @Args("id") id: number): Promise<Character | undefined> {
    const c = await this.character.findById(id);
    return {...c, own: c.userId === user.id};
  }

  @Mutation()
  async editCharacter(
    @Args("id") id: number,
    @Args("character") data: CreateCharacter,
    @GetUser() user: User,
  ): Promise<boolean> {
    try {
      if (user.mainCharacterId !== id) await this.character.getByIdAndOwner(id, user.id);
      await this.character.update(id, data);
      return true;
    } catch (err) {
      const code = ntob(Date.now());
      this.log.error(`ERR${code} ${err.stack}`);
      throw new Error(`Возникла ошибка. Код ошибки: ${code}. Обратитесь к мастерам!`);
    }
  }

  @Mutation()
  async uploadAvatar(
    @Args("id") id: number,
    @Args("avatar") avatar: string,
    @GetUser() user: User,
  ): Promise<Date> {
    if (avatar.length > 666 * 1024 /* 😈, ~= 500KB */ ) throw new Error("Слишком большой размер файла");
    try {
      const buffer = Buffer.from(avatar, "base64");
      const img = imageSizeSync(buffer);
      if (img.type !== "png") throw new Error(`Not a png: ${img.type}`);
      if (img.width > 200 || img.height > 200) throw new Error(`Image size bigger than 200x200: ${img.width}x${img.height}`);
      if (user.mainCharacterId !== id) await this.character.getByIdAndOwner(id, user.id);
      const time = Math.floor(Date.now() / 1000);
      const date = new Date(time * 1000);
      await this.file.uploadFromBuffer(buffer, ["avatar", id.toString() + "_" + time + ".png"]);
      await this.character.update(id, {avatarUploadedAt: date});
      return date;
    } catch (err) {
      const code = ntob(Date.now());
      this.log.error(`ERR${code} ${err.stack}`);
      throw new Error(`Возникла ошибка. Код ошибки: ${code}. Обратитесь к мастерам!`);
    }
  }
}
