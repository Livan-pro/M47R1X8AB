import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Property } from "matrix-database";

@Injectable()
export class PropertyService {
  private readonly log = new Logger(PropertyService.name);
  constructor(
    @InjectRepository(Property)
    private readonly repo: Repository<Property>,
  ) {}

  async createOrUpdate(
    characterId: number,
    name: string,
    value: string,
  ): Promise<void> {
    const query = this.repo.createQueryBuilder()
      .insert()
      .values({characterId, name, value});
    await this.repo.query(query.getQuery() + " ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)", [characterId, name, value]);
  }

  async delete(
    characterId: number,
    name: string,
  ): Promise<void> {
    await this.repo.delete({characterId, name});
  }
}
