import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction, TransactionManager, EntityManager, MoreThan, MoreThanOrEqual } from "typeorm";
import { InventoryItem, ItemGift, Character } from "matrix-database";
import { Client } from "nats";
import { CustomError } from "CustomError";

@Injectable()
export class InventoryService {
  private readonly log = new Logger(InventoryService.name);
  constructor(
    @InjectRepository(InventoryItem)
    private readonly repo: Repository<InventoryItem>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  async getByCharacterId(characterId: number) {
    return await this.repo.find({where: {characterId}});
  }

  @Transaction()
  async transfer(
    fromCharacterId: number,
    toCharacterId: number,
    itemId: number,
    amount: number,
    @TransactionManager() manager?: EntityManager,
  ) {
    const repo = manager.getRepository(InventoryItem);
    const res = await repo.decrement({characterId: fromCharacterId, itemId, amount: MoreThanOrEqual(amount)}, "amount", amount);
    if (res.raw.affectedRows !== 1) throw new CustomError("Недостаточно предметов этого типа!");

    const sql = manager.createQueryBuilder()
      .insert()
      .into(InventoryItem)
      .values({characterId: toCharacterId, itemId, amount})
      .getSql() + " ON DUPLICATE KEY UPDATE `amount` = `amount` + VALUES(`amount`)";
    await manager.query(sql, [toCharacterId, itemId, amount]);
  }

  @Transaction()
  async useItemGift(
    code: Buffer,
    characterId: number,
    @TransactionManager() manager?: EntityManager,
  ): Promise<ItemGift> {
    const repo = manager.getRepository(ItemGift);
    let itemGift: ItemGift;
    try {
      itemGift = await repo.findOneOrFail({code, usedById: null}, {lock: {mode: "pessimistic_write"}});
    } catch (e) {
      throw new CustomError("Предмет не найден или уже использован!");
    }

    const sql = manager.createQueryBuilder()
      .insert()
      .into(InventoryItem)
      .values({characterId, itemId: itemGift.itemId, amount: itemGift.amount})
      .getSql() + " ON DUPLICATE KEY UPDATE `amount` = `amount` + VALUES(`amount`)";
    await manager.query(sql, [characterId, itemGift.itemId, itemGift.amount]);
    await repo.update(itemGift.id, {usedById: characterId, usedAt: new Date()});
    return itemGift;
  }
}
