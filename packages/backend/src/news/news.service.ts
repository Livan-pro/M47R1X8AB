import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { News } from "matrix-database";

@Injectable()
export class NewsService {
  private readonly log = new Logger(NewsService.name);
  constructor(
    @InjectRepository(News)
    private readonly repo: Repository<News>,
  ) {}

  async getAll(): Promise<News[]> {
    return await this.repo.find();
  }
}
