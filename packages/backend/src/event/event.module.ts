import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "matrix-database";
import { EventService } from "./event.service";
import { CacheModule } from "cache/cache.module";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    CacheModule,
  ],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
