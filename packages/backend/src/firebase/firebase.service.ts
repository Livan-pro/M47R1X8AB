import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FirebaseToken } from "matrix-database";

@Injectable()
export class FirebaseService {
  private readonly log = new Logger(FirebaseService.name);
  constructor(
    @InjectRepository(FirebaseToken)
    private readonly repo: Repository<FirebaseToken>,
  ) {}

  async createOrUpdateToken(token: string, userId: number): Promise<void> {
    const query = this.repo.createQueryBuilder()
      .insert()
      .values({token, userId});
    await this.repo.query(query.getQuery() + " ON DUPLICATE KEY UPDATE `userId` = VALUES(`userId`)", [token, userId]);
  }

  async deleteToken(token: string): Promise<void> {
    await this.repo.update({token}, {userId: null});
  }
}
