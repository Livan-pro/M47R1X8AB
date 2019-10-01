import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Location } from "matrix-database";
import { Client } from "nats";

@Injectable()
export class LocationService {
  private readonly log = new Logger(LocationService.name);
  constructor(
    @InjectRepository(Location)
    private readonly repo: Repository<Location>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  async getAll(): Promise<Location[]> {
    return this.repo.find();
  }

  async getById(id: number): Promise<Location> {
    return this.repo.findOneOrFail(id);
  }

  async create(data: Partial<Location>): Promise<Location> {
    return await this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Location>): Promise<void> {
    await this.repo.update(id, data);
  }
}
