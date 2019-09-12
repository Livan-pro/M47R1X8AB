import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, BalanceTransfer, CharacterState } from "matrix-database";
import { CustomError } from "CustomError";
import { Roles } from "auth/roles.decorator";
import { States } from "auth/states.decorator";

@Resolver()
@Roles(Role.LoggedIn)
export class BalanceResolvers {
  private readonly log = new Logger(BalanceResolvers.name);
  constructor(
    private readonly balance: BalanceService,
  ) {}

  @Mutation()
  @States(CharacterState.Normal, CharacterState.Pollution)
  async moneyTransfer(
    @Args("id") id: number,
    @Args("amount") amount: number,
    @GetUser() user: User,
  ): Promise<boolean> {
    if (user.mainCharacterId === id) throw new CustomError("Вы не можете перевести деньги себе");
    if (amount <= 0) throw new CustomError("Неверная сумма перевода");
    await this.balance.moneyTransfer(user.mainCharacterId, id, amount);
    return true;
  }

  @Query()
  @Roles(Role.Admin)
  async allBalanceHistory(): Promise<BalanceTransfer[]> {
    return await this.balance.getAllHistory();
  }
}
