import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, BalanceTransfer, CharacterState, Character, EventType } from "matrix-database";
import { CustomError } from "CustomError";
import { Roles } from "auth/roles.decorator";
import { CharacterService } from "character/character.service";
import { EventService } from "event/event.service";

@Resolver()
@Roles({user: Role.LoggedIn})
export class BalanceResolvers {
  private readonly log = new Logger(BalanceResolvers.name);
  constructor(
    private readonly balance: BalanceService,
    private readonly character: CharacterService,
    private readonly event: EventService,
  ) {}

  @Mutation()
  @Roles({state: [CharacterState.Normal, CharacterState.Pollution]})
  async moneyTransfer(
    @Args("id") id: number,
    @Args("amount") amount: number,
    @GetUser() user: User,
  ): Promise<Character> {
    if (user.mainCharacterId === id) throw new CustomError("Вы не можете перевести деньги себе");
    if (amount <= 0) throw new CustomError("Неверная сумма перевода");
    await this.balance.moneyTransfer(user.mainCharacterId, id, amount);
    await this.event.emit(user.mainCharacter.id, user.id, id, null, EventType.TransferMoney, {amount});
    return await this.character.getById(user.mainCharacterId, ["id", "balance"]);
  }

  @Query()
  @Roles({user: Role.Admin})
  async allBalanceHistory(): Promise<BalanceTransfer[]> {
    return await this.balance.getAllHistory();
  }

  @Mutation()
  @Roles({user: Role.Admin})
  async addBalance(
    @Args("id") id: number,
    @Args("amount") amount: number,
    @GetUser() user: User,
  ): Promise<Partial<Character>> {
    await this.balance.addBalance(id, amount);
    await this.event.emit(user.mainCharacter.id, user.id, id, null, EventType.AddBalance, {amount});
    return await this.character.getById(id, ["id", "balance"]);
  }
}
