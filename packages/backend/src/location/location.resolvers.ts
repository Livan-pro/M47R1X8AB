import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { LocationService } from "./location.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, Location, EventType } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { EventService } from "event/event.service";

@Resolver()
@Roles({user: Role.Admin})
export class LocationResolvers {
  private readonly log = new Logger(LocationResolvers.name);
  constructor(
    private readonly location: LocationService,
    private readonly event: EventService,
  ) {}

  @Query()
  async locations(): Promise<Location[]> {
    return this.location.getAll();
  }

  @Mutation()
  async createLocation(
    @Args("data") data: Partial<Location>,
    @GetUser() user: User,
  ): Promise<Location> {
    const location = await this.location.create(data);
    await this.event.emit(null, user.id, null, null, EventType.CreateLocation, location);
    return location;
  }

  @Mutation()
  async updateLocation(
    @Args("id") id: number,
    @Args("data") data: Partial<Location>,
    @GetUser() user: User,
  ): Promise<Location> {
    await this.location.update(id, data);
    await this.event.emit(null, user.id, null, null, EventType.CreateLocation, {id, ...data});
    return this.location.getById(id);
  }
}
