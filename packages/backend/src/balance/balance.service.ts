import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction, EntityManager, TransactionManager } from "typeorm";
import { Character, BalanceTransfer } from "matrix-database";
import { CustomError } from "CustomError";
import { Client } from "nats";

@Injectable()
export class BalanceService {
  private readonly log = new Logger(BalanceService.name);
  constructor(
    @InjectRepository(BalanceTransfer)
    private readonly repo: Repository<BalanceTransfer>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  async getAllHistory(): Promise<BalanceTransfer[]> {
    return await this.repo.find({
      relations: ["from", "to"],
    });
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
    const fromAmount = await repo.findOneOrFail(fromId, {select: ["id", "balance"]});
    const toAmount = await repo.findOneOrFail(toId, {select: ["id", "balance"]});
    this.nats.publish("backend.character.update", {id: fromId, balance: fromAmount.balance});
    this.nats.publish("backend.character.update", {id: toId, balance: toAmount.balance});
  }

  @Transaction()
  async addBalance(
    toId: number,
    amount: number,
    @TransactionManager() manager?: EntityManager,
  ): Promise<void> {
    const repo = manager.getRepository(Character);
    await repo.increment({id: toId}, "balance", amount);
    const historyRepo = manager.getRepository(BalanceTransfer);
    const transfer = historyRepo.create({toId, amount});
    await historyRepo.save(transfer);
    const toAmount = await repo.findOneOrFail(toId, {select: ["id", "balance"]});
    this.nats.publish("backend.character.update", {id: toId, balance: toAmount.balance});
  }
}
