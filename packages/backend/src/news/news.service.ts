import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { News, AttachmentType } from "matrix-database";
import { FileUpload } from "graphql-upload";
import { AttachmentService } from "attachment/attachment.service";
import { NewsInput } from "graphql.schema";

@Injectable()
export class NewsService {
  private readonly log = new Logger(NewsService.name);
  constructor(
    @InjectRepository(News)
    private readonly repo: Repository<News>,
    private readonly attachment: AttachmentService,
  ) {}

  async getAll(): Promise<News[]> {
    return await this.repo.find({relations: ["attachment"], order: {datetime: "DESC"}});
  }

  async getById(id: number): Promise<News> {
    return await this.repo.findOne(id, {relations: ["attachment"]});
  }

  async create(data: NewsInput, userId: number) {
    const news = this.repo.create({...data, attachment: undefined});
    if (data.attachment) {
      const attachment = await this.attachment.upload(data.attachment.file, data.attachment.type, userId);
      news.attachment = attachment;
      news.attachmentId = attachment.id;
    }
    return await this.repo.save(news);
  }

  async update(id: number, data: NewsInput, userId: number) {
    const news = this.repo.create({...data, attachment: undefined});
    if (data.attachment) {
      const attachment = await this.attachment.upload(data.attachment.file, data.attachment.type, userId);
      news.attachment = attachment;
    }
    await this.repo.update({id}, news);
  }

  async delete(ids: number[] | number) {
    await this.repo.delete(ids);
  }
}
