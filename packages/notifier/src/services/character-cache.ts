import { Service, Inject } from "typedi";
import { Logger } from "pino";
import { Client } from "nats";
import { Character } from "matrix-database";
import { Connection, Repository } from "typeorm";

@Service()
export class CharacterCacheService {
  private log: Logger;
  @Inject("NATS") private nats: Client;
  private readonly repo: Repository<Character>;
  private readonly names = new Map<number, string>(); // key = characterId, value = name

  constructor(
    @Inject("LOGGER") logger: Logger,
    @Inject("CONNECTION") connection: Connection,
  ) {
    this.log = logger.child({scope: CharacterCacheService.name});
    this.repo = connection.getRepository<Character>(Character);
  }

  async init() {
    this.nats.subscribe("*.character.update", (char: Partial<Character>) => this.onUpdate(char));
    const chars = await this.repo.find({select: ["id", "name"]});
    for (const char of chars) {
      this.names.set(char.id, char.name);
    }
  }

  public getNameByCharacterId(characterId: number) {
    return this.names.get(characterId);
  }

  private onUpdate(data: Partial<Character>) {
    if (!data.id) return;
    if (!data.name) return;
    this.names.set(data.id, data.name);
  }
}