import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character, InventoryItem } from "matrix-database";
import { InventoryService } from "./inventory.service";
import { InventoryResolvers } from "./inventory.resolvers";
import { CacheModule } from "cache/cache.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Character, InventoryItem]),
    CacheModule,
  ],
  providers: [InventoryService, InventoryResolvers],
  exports: [InventoryService],
})
export class InventoryModule {}
