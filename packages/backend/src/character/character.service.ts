import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction, EntityManager, TransactionManager } from "typeorm";
import { User, BalanceTransfer } from "matrix-database";
import { Character } from "matrix-database";
import { FileUpload } from "graphql-upload";
import { FileService } from "file/file.service";
import { CustomError } from "CustomError";

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

  @Transaction()
  async moneyTransfer(
    fromId: number,
    toId: number,
    amount: number,
    @TransactionManager() manager?: EntityManager,
  ): Promise<void> {
    const repo = manager.getRepository(Character);
    await repo.decrement({id: fromId}, "balance", amount);
    const char = await repo.findOneOrFail({id: fromId});
    if (char.balance < 0) throw new CustomError("Недостаточно средств!");
    await repo.increment({id: toId}, "balance", amount);
    const historyRepo = manager.getRepository(BalanceTransfer);
    const transfer = historyRepo.create({fromId, toId, amount});
    await historyRepo.save(transfer);
  }
}
