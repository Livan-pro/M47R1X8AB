import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan } from "typeorm";
import { Message } from "matrix-database";
import { MessageInput, Chat } from "graphql.schema";
import { Client } from "nats";
import { EventService } from "event/event.service";

@Injectable()
export class MessageService {
  private readonly log = new Logger(MessageService.name);
  constructor(
    @InjectRepository(Message)
    private readonly repo: Repository<Message>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  async getLastMessagesForCharacter(characterId: number): Promise<Message[]> {
    return this.repo.create((await this.repo.query(
      "SELECT m.id, m.createdAt, m.fromId, m.toId, m.text FROM messages m INNER JOIN " +
      "(SELECT LEAST(fromId, toId) AS minId, GREATEST(fromId, toId) AS maxId, MAX(id) AS id FROM messages " +
      "WHERE fromId = ? OR toId = ? GROUP BY minId, maxId) i ON m.id = i.id", [characterId, characterId])) as Array<Partial<Message>>);
  }

  async getLastMessageForChat(chatId: number, characterId: number): Promise<Message | null> {
    return await this.repo.findOne({where: [
      {fromId: chatId, toId: characterId},
      {fromId: characterId, toId: chatId},
    ], order: {id: "DESC"}});
  }

  async getForChat(chatId: number, characterId: number, beforeId?: number): Promise<Message[]> {
    const idCondition = beforeId ? {id: LessThan(beforeId)} : {};
    return (await this.repo.find({where: [
      {fromId: chatId, toId: characterId, ...idCondition},
      {fromId: characterId, toId: chatId, ...idCondition},
    ], order: {id: "DESC"}, take: 10})).reverse();
  }

  async getById(id: number): Promise<Message> {
    return await this.repo.findOne(id, {relations: ["attachment"]});
  }

  async send(fromId: number, toId: number, data: MessageInput): Promise<Message> {
    const message = await this.repo.save(this.repo.create({...data, fromId, toId} as Partial<Message>));
    this.nats.publish("backend.message.new", message);
    return message;
  }
}
