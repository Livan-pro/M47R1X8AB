import { Service, Inject } from "typedi";
import { IService } from "../service.interface";
import { Logger } from "pino";
import { Connection, Repository } from "typeorm";
import { EventType, Event } from "matrix-database";
import { Client } from "nats";
import { UserCacheService } from "./user-cache";

@Service()
export class EventService implements IService {
  private readonly log: Logger;
  private readonly repo: Repository<Event>;
  @Inject() private readonly uCache: UserCacheService;
  constructor(
    @Inject("LOGGER") logger: Logger,
    @Inject("CONNECTION") connection: Connection,
    @Inject("NATS") private readonly nats: Client,
  ) {
    this.log = logger.child({scope: EventService.name});
    this.repo = connection.getRepository<Event>(Event);
  }

  async init() {
    return;
  }

  async emit(
    causedByCharacterId: number,
    causedByUserId: number,
    affectedCharacterId: number,
    affectedUserId: number,
    type: EventType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
  ): Promise<void> {
    try {
      if (affectedCharacterId !== null && affectedUserId === null) affectedUserId = this.uCache.getUserId(affectedCharacterId);
      const event = await this.repo.save({causedByCharacterId, causedByUserId, affectedCharacterId, affectedUserId, type, data});
      await this.nats.publish(`timers.event.${type}`, event);
    } catch (error) {
      this.log.error(`Error while emitting event: ${error.stack}`);
    }
  }
}