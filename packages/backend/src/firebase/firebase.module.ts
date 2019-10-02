import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseToken } from "matrix-database";
import { FirebaseService } from "./firebase.service";
import { FirebaseResolvers } from "./firebase.resolvers";
import { CacheModule } from "cache/cache.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([FirebaseToken]),
    CacheModule,
  ],
  providers: [FirebaseService, FirebaseResolvers],
  exports: [FirebaseService],
})
export class FirebaseModule {}
