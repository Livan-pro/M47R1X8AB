import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Logger, Inject } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { Client } from "nats";
import { CustomError } from "CustomError";
import { InventoryItem as GInventoryItem } from "graphql.schema";

@Resolver()
@Roles(Role.LoggedIn)
export class InventoryResolvers {
  private readonly log = new Logger(InventoryResolvers.name);
  constructor(
    private readonly inventory: InventoryService,
    @Inject("NATS")
    private readonly nats: Client,
  ) {}

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
    await this.inventory.transfer(user.mainCharacterId, to, itemId, amount);
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
    return await this.inventory.useItemGift(buf, user.mainCharacterId);
  }
}
