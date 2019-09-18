import { Resolver, Query, Subscription, Mutation, Args } from "@nestjs/graphql";
import { Logger, Inject } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { Client } from "nats";
import { CustomError } from "CustomError";

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
  async qInventory(@GetUser() user: User) {
    return await this.inventory.getByCharacterId(user.mainCharacterId);
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
}
