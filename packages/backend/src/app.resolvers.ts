import { Resolver, Query } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";

@Resolver()
// @UseGuards(AuthGuard("jwt"))
export class AppResolvers {
  private readonly log = new Logger(AppResolvers.name);

  @Query() // Needed while there is no queries
  async none(): Promise<boolean | null> {
    return true;
  }
}
