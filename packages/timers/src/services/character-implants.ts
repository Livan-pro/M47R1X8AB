import { Service, Inject } from "typedi";
import { IService } from "../service.interface";
import { Logger } from "pino";
import { Connection, Repository, Transaction, Not, IsNull, TransactionManager, EntityManager, In } from "typeorm";
import { Character, Implant } from "matrix-database";
import { Client } from "nats";

@Service()
export class CharacterImplantsService implements IService {
  private readonly log: Logger;
  private readonly repo: Repository<Character>;
  private readonly timers: Map<number, NodeJS.Timeout> = new Map();
  constructor(
    @Inject("LOGGER") logger: Logger,
    @Inject("CONNECTION") connection: Connection,
    @Inject("NATS") private readonly nats: Client,
  ) {
    this.log = logger.child({scope: CharacterImplantsService.name});
    this.repo = connection.getRepository<Character>(Character);
  }

  async init() {
    const characters = await this.repo.find({select: ["id"], where: {implantsRejectTime: Not(IsNull())}});
    for (const char of characters) {
      await this.tick(char.id);
    }
    this.nats.subscribe("backend.character.update", (data: Partial<Character>) => this.onCharacterUpdate(data));
  }

  private setupTimer(char: Partial<Character>): boolean {
    const id = char.id;
    const now = Date.now();
    const implantsRejectTime = char.implantsRejectTime.getTime();
    if (now > implantsRejectTime) {
      if (this.timers.has(char.id)) clearTimeout(this.timers.get(char.id));
    } else {
      if (this.timers.has(char.id)) clearTimeout(this.timers.get(char.id));
      const time = implantsRejectTime - now;
      this.timers.set(id, setTimeout(() => this.tick(id), time));
    }
    return true;
  }

  @Transaction()
  private async tick(
    characterId: number,
    @TransactionManager() manager?: EntityManager,
  ) {
    const cRepo = manager.getRepository(Character);
    let char = await cRepo.findOneOrFail(characterId, {
      select: ["id", "implantsRejectTime"],
      lock: {mode: "pessimistic_read"},
    });
    if (char.implantsRejectTime <= new Date()) {
      const update = {implantsRejectTime: null};
      await cRepo.update(characterId, update);
      this.nats.publish("timers.character.update", {...update, id: characterId});
    }
    this.setupTimer(char);
  }

  private onCharacterUpdate(char: Partial<Character>) {
    this.log.debug("character update", {char});
    if (!Object.hasOwnProperty.call(char, "id")) {
      this.log.warn("Received character update without id", char);
      return;
    }
    if (!char.implantsRejectTime) return;
    this.tick(char.id);
  }
}