import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character, Location } from "matrix-database";
import { LocationService } from "./location.service";
import { LocationResolvers } from "./location.resolvers";

@Module({
  imports: [
    TypeOrmModule.forFeature([Character, Location]),
  ],
  providers: [LocationService, LocationResolvers],
  exports: [LocationService],
})
export class LocationModule {}
