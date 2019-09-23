import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { LocationService } from "./location.service";
import { GetUser } from "user/get-user.decorator";
import { User, UserRole as Role, CharacterState, CharacterRole, Location } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { CustomError } from "CustomError";

@Resolver()
@Roles(Role.Admin)
export class LocationResolvers {
  private readonly log = new Logger(LocationResolvers.name);
  constructor(
    private readonly location: LocationService,
  ) {}

  @Query()
  async locations(): Promise<Location[]> {
    return this.location.getAll();
  }

  @Mutation()
  async createLocation(
    @Args("data") data: Partial<Location>,
  ): Promise<Location> {
    return await this.location.create(data);
  }

  @Mutation()
  async updateLocation(
    @Args("id") id: number,
    @Args("data") data: Partial<Location>,
  ): Promise<Location> {
    await this.location.update(id, data);
    return this.location.getById(id);
  }
}
