import { Resolver, Query, Subscription, Mutation, Args } from "@nestjs/graphql";
import { Logger, Inject } from "@nestjs/common";
import { FirebaseService } from "./firebase.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, EventType } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { Client } from "nats";
import { EventService } from "event/event.service";

@Resolver()
export class FirebaseResolvers {
  private readonly log = new Logger(FirebaseResolvers.name);
  constructor(
    private readonly firebase: FirebaseService,
    private readonly event: EventService,
  ) {}

  @Mutation()
  @Roles({user: Role.LoggedIn})
  async setFirebaseToken(
    @Args("token") token: string,
    @GetUser() user: User,
  ): Promise<boolean> {
    await this.firebase.createOrUpdateToken(token, user.id);
    await this.event.emit(null, user.id, null, null, EventType.SetFirebaseToken, {token, userId: user.id});
    return true;
  }

  @Mutation()
  async unsetFirebaseToken(
    @Args("token") token: string,
  ): Promise<boolean> {
    await this.firebase.deleteToken(token);
    await this.event.emit(null, null, null, null, EventType.UnsetFirebaseToken, {token});
    return true;
  }
}
