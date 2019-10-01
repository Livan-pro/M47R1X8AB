import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Logger, Inject } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, ItemGift, Profession, CharacterRole, CharacterState, EventType } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { Client } from "nats";
import { CustomError } from "CustomError";
import { InventoryItem as GInventoryItem, InventoryItem } from "graphql.schema";
import { mapCodeToString, codeToString } from "utils";
import { EventService } from "event/event.service";

@Resolver()
@Roles({user: Role.LoggedIn})
export class InventoryResolvers {
  private readonly log = new Logger(InventoryResolvers.name);
  constructor(
    private readonly inventory: InventoryService,
    private readonly event: EventService,
    @Inject("NATS")
    private readonly nats: Client,
  ) {}

  @Query()
  @Roles({user: Role.Admin})
  async listItemGift() {
    return mapCodeToString(await this.inventory.getAllItemGifts());
  }

  @Mutation()
  @Roles({user: Role.Admin})
  async createItemGift(
    @Args("code") code: string,
    @Args("itemId") itemId: number,
    @Args("amount") amount: number,
    @GetUser() user: User,
  ): Promise<ItemGift> {
    if (code.length !== 16) throw new CustomError("Неверный код!");
    let buf: Buffer;
    try {
      buf = Buffer.from(code, "hex");
    } catch (e) {
      throw new CustomError("Неверный код!");
    }
    try {
      const data = await this.inventory.createItemGift(buf, itemId, amount);
      await this.event.emit(null, user.id, null, null, EventType.CreateItemGift, data);
      return codeToString(data);
    } catch (err) {
      if (err.code && err.code === "ER_DUP_ENTRY") throw new CustomError("QR-код с таким кодом уже существует");
      throw err;
    }
  }

  @Query("inventory")
  async qInventory(
    @Args("id") id: number,
    @GetUser() user: User,
  ) {
    if (id) {
      if (!user.roles.has(Role.Admin)) {
        throw new CustomError("У вас нет доступа к инвентарю этого персонажа!");
      }
      return this.inventory.getByCharacterId(id);
    } else return await this.inventory.getByCharacterId(user.mainCharacterId);
  }

  @Mutation()
  async transferItem(
    @Args("to") to: number,
    @Args("itemId") itemId: number,
    @Args("amount") amount: number,
    @GetUser() user: User,
  ): Promise<void> {
    if (to === user.mainCharacterId) throw new CustomError("Вы не можете передать предмет себе!");
    if (amount < 1) throw new CustomError("Неверное количество предметов!");
    await this.inventory.transfer(user.mainCharacterId, to, itemId, amount);
    await this.event.emit(user.mainCharacterId, user.id, to, null, EventType.TransferItem, {itemId, amount});
  }

  @Mutation()
  @Roles({user: Role.Admin})
  async addItems(
    @Args("characterId") characterId: number,
    @Args("itemId") itemId: number,
    @Args("amount") amount: number,
    @GetUser() user: User,
  ): Promise<InventoryItem> {
    await this.inventory.add(characterId, itemId, amount);
    const data = await this.inventory.getByCharacterIdAndItemId(characterId, itemId);
    await this.event.emit(user.mainCharacterId, user.id, characterId, null, EventType.AddItem, {itemId, amount});
    return data;
  }

  @Mutation()
  async useItemGift(
    @Args("code") code: string,
    @GetUser() user: User,
  ): Promise<GInventoryItem> {
    if (code.length !== 16) throw new CustomError("Неверный код предмета!");
    let buf: Buffer;
    try {
      buf = Buffer.from(code, "hex");
    } catch (e) {
      throw new CustomError("Неверный код предмета!");
    }
    const data = await this.inventory.useItemGift(buf, user.mainCharacterId);
    await this.event.emit(user.mainCharacterId, user.id, user.mainCharacterId, user.id, EventType.UseItemGift, data);
    return data;
  }

  @Mutation()
  @Roles(
    {profession: Profession.Chemist, state: [CharacterState.Normal, CharacterState.Pollution]},
    {character: CharacterRole.Technician, state: [CharacterState.Normal, CharacterState.Pollution]},
  )
  async consumeItem(
    @Args("itemId") itemId: number,
    @Args("amount") amount: number,
    @GetUser() user: User,
  ): Promise<InventoryItem> {
    if (!(
      (itemId === 1 && user.mainCharacter.roles.has(CharacterRole.Technician)) ||
      (itemId === 2 && user.mainCharacter.profession === Profession.Chemist)
    )) {
      throw new CustomError("У вас нет возможности списывать этот предмет!");
    }
    if (amount < 1) throw new CustomError("Неверное количество предметов!");
    await this.inventory.add(user.mainCharacterId, itemId, -amount);
    await this.event.emit(user.mainCharacterId, user.id, user.mainCharacterId, user.id, EventType.ConsumeItem, {itemId, amount});
    return await this.inventory.getByCharacterIdAndItemId(user.mainCharacterId, itemId);
  }
}
