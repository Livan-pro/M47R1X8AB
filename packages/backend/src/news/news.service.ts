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

  async create(data: Partial<News>) {
    const news = this.repo.create(data);
    return await this.repo.save(news);
  }

  async update(id: number, data: Partial<News>) {
    const news = this.repo.create(data);
    await this.repo.update({id}, news);
  }

  async delete(ids: number[] | number) {
    await this.repo.delete(ids);
  }
}
