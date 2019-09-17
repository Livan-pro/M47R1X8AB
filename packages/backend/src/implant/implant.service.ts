import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Implant } from "matrix-database";
import { Client } from "nats";

@Injectable()
export class ImplantService {
  private readonly log = new Logger(ImplantService.name);
  constructor(
    @InjectRepository(Implant)
    private readonly repo: Repository<Implant>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  async getByCharacterId(characterId: number): Promise<Implant[]> {
    return await this.repo.find({where: {characterId}});
  }

  async create(data: Partial<Implant>): Promise<Implant> {
    const implant = await this.repo.save(this.repo.create(data));
    this.nats.publish("backend.implant.update", implant);
    return implant;
  }

  async update(id: number, data: Partial<Implant>): Promise<void> {
    const implant = this.repo.create(data);
    await this.repo.update(id, implant);
    this.nats.publish("backend.implant.update", {...implant, id});
  }
}
