import { Injectable, Logger, Inject, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message, Character } from "matrix-database";
import { Client } from "nats";

@Injectable()
export class MessageCacheService implements OnModuleInit {
  private readonly log = new Logger(MessageCacheService.name);
  private readonly firstDialogIds: Map<string, number> = new Map(); // key = `${minId}_${maxId}`, value = first message id
  constructor(
    @InjectRepository(Message)
    private readonly repo: Repository<Message>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  async onModuleInit(): Promise<void> {
    this.nats.subscribe("*.message.new", (data: Message) => this.onMessage(data));
    const dialogs = (await this.repo.query(
      "SELECT LEAST(fromId, toId) AS minId, GREATEST(fromId, toId) AS maxId, MIN(id) AS id FROM messages GROUP BY minId, maxId",
    )) as Array<{minId: number, maxId: number, id: number}>;
    for (const d of dialogs) {
      this.firstDialogIds.set(`${d.minId}_${d.maxId}`, d.id);
    }
  }

  private async onMessage(data: Message) {
    if (!Object.hasOwnProperty.call(data, "id")) {
      this.log.warn(`Received new message without id ${JSON.stringify(data)}`);
      return;
    }
    if (!Object.hasOwnProperty.call(data, "fromId")) {
      this.log.warn(`Received new message without fromId ${JSON.stringify(data)}`);
      return;
    }
    if (!Object.hasOwnProperty.call(data, "toId")) {
      this.log.warn(`Received new message without toId ${JSON.stringify(data)}`);
      return;
    }
    const key = this.getKey(data.fromId, data.toId);
    if (this.firstDialogIds.has(key)) return;
    this.firstDialogIds.set(key, data.id);
  }

  public isFirstInChat(characterId: number, chatId: number, messageId: number): boolean {
    const first = this.firstDialogIds.get(this.getKey(characterId, chatId));
    return !first || first === messageId;
  }

  private getKey(id1: number, id2: number): string {
    return id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
  }
}
