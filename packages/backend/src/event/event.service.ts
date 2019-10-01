import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event, EventType } from "matrix-database";
import { Client } from "nats";

@Injectable()
export class EventService {
  private readonly log = new Logger(EventService.name);
  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  async emit(
    causedByCharacterId: number,
    causedByUserId: number,
    affectedCharacterId: number,
    affectedUserId: number,
    type: EventType,
    data?: any,
  ): Promise<void> {
    try {
      const event = await this.repo.save({causedByCharacterId, causedByUserId, affectedCharacterId, affectedUserId, type, data});
      await this.nats.publish(`backend.event.${type}`, event);
    } catch (error) {
      this.log.error(`Error while emitting event: ${error.stack}`);
    }
  }
}
