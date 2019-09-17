import { Injectable, Logger, Inject, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Implant } from "matrix-database";
import { Client } from "nats";

@Injectable()
export class ImplantCacheService implements OnModuleInit {
  private readonly log = new Logger(ImplantCacheService.name);
  private readonly charIds: Map<number, number> = new Map();
  constructor(
    @InjectRepository(Implant)
    private readonly repo: Repository<Implant>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  async onModuleInit(): Promise<void> {
    this.nats.subscribe("*.implant.update", (data: Partial<Implant>) => this.onImplantUpdate(data));
    const implants = await this.repo.find({select: ["id", "characterId"]});
    for (const i of implants) {
      this.charIds.set(i.id, i.characterId);
    }
  }

  private async onImplantUpdate(implant: Partial<Implant>) {
    if (!Object.hasOwnProperty.call(implant, "id")) {
      this.log.warn(`Received implant update without id ${JSON.stringify(implant)}`);
      return;
    }
    if (!Object.hasOwnProperty.call(implant, "characterId")) return;
    this.charIds.set(implant.id, implant.characterId);
  }

  public getCharacterId(implantId: number): number {
    return this.charIds.get(implantId);
  }
}
