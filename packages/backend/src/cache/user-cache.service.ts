import { Injectable, Logger, Inject, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "matrix-database";
import { Client } from "nats";

@Injectable()
export class UserCacheService implements OnModuleInit {
  private readonly log = new Logger(UserCacheService.name);
  private readonly charIds: Map<number, number> = new Map();
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  async onModuleInit(): Promise<void> {
    this.nats.subscribe("*.user.update", (data: Partial<User>) => this.onUserUpdate(data));
    const users = await this.repo.find({select: ["id", "mainCharacterId"]});
    for (const u of users) {
      this.charIds.set(u.id, u.mainCharacterId);
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

  public getMainCharacterId(userId: number): number {
    return this.charIds.get(userId);
  }
}
