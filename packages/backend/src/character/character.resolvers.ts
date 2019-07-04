import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { Logger, ValidationPipe, UseGuards } from "@nestjs/common";
import { CharacterService } from "./character.service";
import { CreateCharacter } from "shared/node";
import { ntob } from "number-to-base64";
import { GqlAuthGuard } from "auth/gql-auth.guard";
import { GetUser } from "user/get-user.decorator";
import { User } from "matrix-database";
import { Character } from "graphql.schema";

@Resolver()
@UseGuards(GqlAuthGuard)
export class CharacterResolvers {
  private readonly log = new Logger(CharacterResolvers.name);
  constructor(
    private readonly character: CharacterService,
  ) {}

  @Query()
  async characters(): Promise<Character[]> {
    return this.character.getAll();
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
}
