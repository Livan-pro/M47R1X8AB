import { Service, Inject } from "typedi";
import { IService } from "service.interface";
import { Logger } from "pino";
import { Connection, Repository, Transaction, TransactionRepository, In } from "typeorm";
import { Character, CharacterState } from "matrix-database";
import { Client } from "nats";
import { CharacterUtils } from "bshared";

@Service()
export class CharacterService implements IService {
  private readonly log: Logger;
  private readonly repo: Repository<Character>;
  private readonly timers: Map<number, NodeJS.Timeout> = new Map();
  constructor(
    @Inject("LOGGER") logger: Logger,
    @Inject("CONNECTION") connection: Connection,
    @Inject("NATS") private readonly nats: Client,
  ) {
    this.log = logger.child({scope: CharacterService.name});
    this.repo = connection.getRepository<Character>(Character);
  }

  async init() {
    const characters = await this.repo.find({select: ["id"], where: {state: In([CharacterState.Pollution, CharacterState.SevereWound])}});
    for (const char of characters) {
      await this.tick(char.id);
    }
    this.nats.subscribe("backend.character.update", (data: Character) => this.onCharacterUpdate(data));
  }

  private setupTimer(char: Partial<Character>): boolean {
    let time: number;
    const id = char.id;
    switch(char.state) {
      case CharacterState.Normal:
      case CharacterState.Death:
        if (!this.timers.has(char.id)) break;
        clearTimeout(this.timers.get(char.id));
        break;
      case CharacterState.Pollution:
        if (this.timers.has(char.id)) clearTimeout(this.timers.get(char.id));
        if (!char.pollutionStartTime) return false;
        time = CharacterUtils.pollutionTickTime - ((Date.now() - char.pollutionStartTime.getTime()) % CharacterUtils.pollutionTickTime);
        this.timers.set(id, setTimeout(() => this.tick(id), time));
        break;
      case CharacterState.SevereWound:
        if (this.timers.has(char.id)) clearTimeout(this.timers.get(char.id));
        if (!char.deathTime) return false;
        time = char.deathTime.getTime() - Date.now();
        this.timers.set(id, setTimeout(() => this.tick(id), time));
        break;
    }
    return true;
  }

  @Transaction()
  private async tick(
    id: number,
    @TransactionRepository(Character) repo?: Repository<Character>,
  ) {
    let char = await repo.findOneOrFail(id, {
      select: ["id", "state", "deathTime", "pollution", "pollutionStartTime"],
      lock: {mode: "pessimistic_read"},
    });
    const update: Partial<Character> = {};
    let pollution: number;
    switch(char.state) {
      case CharacterState.Pollution:
        pollution = CharacterUtils.getPollutionByTime(char.pollutionStartTime);
        if (pollution === char.pollution) break;
        update.pollution = pollution;
        if (char.pollution >= 100) {
          update.state = CharacterState.SevereWound;
          update.deathTime = new Date(Date.now() + CharacterUtils.severeWoundDeathTime);
        }
        break;
      case CharacterState.SevereWound:
        if (new Date() < char.deathTime) break;
        update.state = CharacterState.Death;
        break;
    }
    if (Object.keys(update).length > 0) {
      char = {...char, ...update};
      await repo.update(id, update);
      this.nats.publish("timers.character.update", {...update, id});
    }
    this.setupTimer(char);
  }

  private onCharacterUpdate(char: Partial<Character>) {
    this.log.debug("character update", {char});
    if (!Object.hasOwnProperty.call(char, "id")) {
      this.log.warn("Received character update without id", char);
      return;
    }
    if (char.pollutionStartTime) char.pollutionStartTime = new Date(char.pollutionStartTime);
    if (char.deathTime) char.deathTime = new Date(char.deathTime);
    if (Object.hasOwnProperty.call(char, "state") ?
      !this.setupTimer(char) :
      ["pollutionStartTime", "deathTime"].some(key => Object.hasOwnProperty.call(char, key))
    ) {
      this.tick(char.id);
    }
  }
}