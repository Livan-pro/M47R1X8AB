import { Service, Inject } from "typedi";
import { IService } from "../service.interface";
import { Logger } from "pino";
import { Connection, Repository, IsNull } from "typeorm";
import { Character, CharacterState } from "matrix-database";
import { Client } from "nats";
import { CharacterUtils } from "bshared";

@Service()
export class HomelessPollutionService implements IService {
  private readonly log: Logger;
  private readonly repo: Repository<Character>;
  private timer: NodeJS.Timeout | null = null;
  constructor(
    @Inject("LOGGER") logger: Logger,
    @Inject("CONNECTION") connection: Connection,
    @Inject("NATS") private readonly nats: Client,
  ) {
    this.log = logger.child({scope: HomelessPollutionService.name});
    this.repo = connection.getRepository<Character>(Character);
  }

  async init() {
    this.timer = setTimeout(() => this.startTicking(), CharacterUtils.homelessTickTime - (Date.now() % CharacterUtils.homelessTickTime));
  }

  private async startTicking() {
    this.timer = setInterval(() => this.tick(), CharacterUtils.homelessTickTime);
    await this.tick();
  }

  private async tick() {
    const chars = await this.repo.find({where: {state: CharacterState.Normal, locationId: IsNull()}, select: ["id"]});
    for (const char of chars) {
      if (!CharacterUtils.getHomelessPollutionStarted()) continue;
      this.log.info(`Starting pollution for character ${char.id}...`);
      await this.startPollution(char.id);
    }
  }

  private async startPollution(id: number) {
    const update = {state: CharacterState.Pollution, pollutionStartTime: new Date()};
    await this.repo.update(id, update);
    this.nats.publish("timers1.character.update", {...update, id});
  }
}