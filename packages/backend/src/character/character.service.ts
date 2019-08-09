import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction, EntityManager, TransactionManager } from "typeorm";
import { Character } from "matrix-database";
import { FileUpload } from "graphql-upload";
import { FileService } from "file/file.service";

@Injectable()
export class CharacterService {
  private readonly log = new Logger(CharacterService.name);
  constructor(
    @InjectRepository(Character)
    private readonly repo: Repository<Character>,
    private readonly file: FileService,
  ) {}

  async getByIdAndOwner(id: number, userId: number): Promise<Character> {
    return await this.repo.findOneOrFail({id, userId});
  }

  async getAll(fields: Array<keyof Character>): Promise<Character[]> {
    return await this.repo.find({select: fields});
  }

  async findById(id: number, fields?: Array<keyof Character>): Promise<Character | undefined> {
    return await this.repo.findOne(id, {select: fields});
  }

  @Transaction()
  async update(
    id: number,
    data: Partial<Character>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<void> {
    const repo = manager.getRepository(Character);
    const quenta = await (data.quenta as unknown as FileUpload);
    if (quenta) data = {...data, quenta: quenta.filename};
    else delete data.quenta;
    await repo.update(id, data);

    if (quenta && quenta.filename) {
      this.log.log("Uploading file...");
      await this.file.upload(quenta, ["quenta", id.toString(), quenta.filename]);
      this.log.log("Done!");
    }
  }
}
