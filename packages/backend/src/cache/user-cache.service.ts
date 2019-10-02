import { Injectable, Logger, Inject, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, Character } from "matrix-database";
import { Client } from "nats";

@Injectable()
export class UserCacheService implements OnModuleInit {
  private readonly log = new Logger(UserCacheService.name);
  private readonly charIds: Map<number, number> = new Map(); // key = userId, value = mainCharacterId
  private readonly userIds: Map<number, number> = new Map(); // key = charId, value = userId
  constructor(
    @InjectRepository(User)
    private readonly uRepo: Repository<User>,
    @InjectRepository(Character)
    private readonly cRepo: Repository<Character>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  async onModuleInit(): Promise<void> {
    this.nats.subscribe("*.user.update", (data: Partial<User>) => this.onUserUpdate(data));
    const users = await this.uRepo.find({select: ["id", "mainCharacterId"]});
    for (const u of users) {
      this.charIds.set(u.id, u.mainCharacterId);
    }
    this.nats.subscribe("*.character.update", (data: Partial<Character>) => this.onCharacterUpdate(data));
    const chars = await this.cRepo.find({select: ["id", "userId"]});
    for (const c of chars) {
      this.userIds.set(c.id, c.userId);
    }
  }

  private async onUserUpdate(user: Partial<User>) {
    if (!Object.hasOwnProperty.call(user, "id")) {
      this.log.warn(`Received user update without id ${JSON.stringify(user)}`);
      return;
    }
    if (!Object.hasOwnProperty.call(user, "mainCharacterId")) return;
    this.charIds.set(user.id, user.mainCharacterId);
  }

  private async onCharacterUpdate(character: Partial<Character>) {
    if (!Object.hasOwnProperty.call(character, "id")) {
      this.log.warn(`Received character update without id ${JSON.stringify(character)}`);
      return;
    }
    if (!Object.hasOwnProperty.call(character, "userId")) return;
    this.userIds.set(character.id, character.userId);
  }

  public getMainCharacterId(userId: number): number {
    return this.charIds.get(userId);
  }

  public getUserId(characterId: number): number {
    return this.userIds.get(characterId);
  }
}
