import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction, EntityManager, TransactionManager } from "typeorm";
import { Character, CharacterState } from "matrix-database";
import { FileUpload } from "graphql-upload";
import { FileService } from "file/file.service";
import { Client } from "nats";

@Injectable()
export class CharacterService {
  private readonly log = new Logger(CharacterService.name);
  private readonly severeWoundDeathTime = 30 * 60 * 1000;
  constructor(
    @InjectRepository(Character)
    private readonly repo: Repository<Character>,
    private readonly file: FileService,
    @Inject("NATS") private readonly nats: Client,
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

  async findByOwner(userId: number): Promise<Character[]> {
    return await this.repo.find({userId});
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

    if (data.state) {
      switch (data.state) {
        case CharacterState.Normal:
          if (!data.pollution) data.pollution = 0;
          if (!data.pollutionStartTime) data.pollutionStartTime = null;
          if (!data.deathTime) data.deathTime = null;
          break;
        case CharacterState.Pollution:
          if (!data.pollution) data.pollution = 0;
          if (!data.pollutionStartTime) data.pollutionStartTime = new Date();
          break;
        case CharacterState.SevereWound:
          if (!data.deathTime) data.deathTime = new Date(Date.now() + this.severeWoundDeathTime);
          break;
        case CharacterState.Death:
          if (!data.deathTime) data.deathTime = new Date();
          break;
      }
    }

    await repo.update(id, data);
    this.nats.publish("backend.character.update", {...data, id});

    if (quenta && quenta.filename) {
      this.log.log("Uploading file...");
      await this.file.upload(quenta, ["quenta", id.toString(), quenta.filename]);
      this.log.log("Done!");
    }
  }
}
