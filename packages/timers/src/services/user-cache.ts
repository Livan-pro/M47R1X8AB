import { Service, Inject } from "typedi";
import { IService } from "../service.interface";
import { Logger } from "pino";
import { Connection, Repository } from "typeorm";
import { Character } from "matrix-database";
import { Client } from "nats";

@Service()
export class UserCacheService implements IService {
  private readonly log: Logger;
  private readonly repo: Repository<Character>;
  private readonly userIds: Map<number, number> = new Map(); // key = charId, value = userId
  constructor(
    @Inject("LOGGER") logger: Logger,
    @Inject("CONNECTION") connection: Connection,
    @Inject("NATS") private readonly nats: Client,
  ) {
    this.log = logger.child({scope: UserCacheService.name});
    this.repo = connection.getRepository<Character>(Character);
  }

  async init() {
    this.nats.subscribe("*.character.update", (data: Partial<Character>) => this.onCharacterUpdate(data));
    const chars = await this.repo.find({select: ["id", "userId"]});
    for (const c of chars) {
      this.userIds.set(c.id, c.userId);
    }
  }

  private async onCharacterUpdate(character: Partial<Character>) {
    if (!Object.hasOwnProperty.call(character, "id")) {
      this.log.warn(`Received character update without id ${JSON.stringify(character)}`);
      return;
    }
    if (!Object.hasOwnProperty.call(character, "userId")) return;
    this.userIds.set(character.id, character.userId);
  }

  public getUserId(characterId: number): number {
    return this.userIds.get(characterId);
  }
}