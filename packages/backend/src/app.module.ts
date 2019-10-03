import { Module, Global } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { Config } from "config";
import { Request, Response } from "express";
import * as NATS from "nats";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { CharacterModule } from "character/character.module";
import { UserModule } from "./user/user.module";
import { DateScalar } from "./date.scalar";
import { AppResolvers } from "./app.resolvers";
import { NewsModule } from "./news/news.module";
import { APP_GUARD } from "@nestjs/core";
import { MyGuard } from "auth/my.guard";
import { BalanceModule } from "balance/balance.module";
import { AttachmentModule } from "attachment/attachment.module";
import { ConnectionContext } from "subscriptions-transport-ws";
import * as WebSocket from "ws";
import { parse as parseCookie } from "cookie";
import { CacheModule } from "cache/cache.module";
import { FileModule } from "file/file.module";
import { MedicineModule } from "medicine/medicine.module";
import { ImplantModule } from "implant/implant.module";
import { InventoryModule } from "inventory/inventory.module";
import { LocationModule } from "location/location.module";
import { EventModule } from "event/event.module";
import { FirebaseModule } from "firebase/firebase.module";
import { MessageModule } from "message/message.module";

@Global()
@Module({
  imports: [
    GraphQLModule.forRoot({
      context: (data: {req: Request, res: Response} | {connection: {context: {req: Request}}}) => {
        if ("connection" in data) return {req: data.connection.context.req};
        else return {req: data.req, res: data.res};
      },
      // context: ({ req, res }: {req: Request, res: Response}) => ({ req, res }),
      tracing: Config.getBoolean("GRAPHQL_TRACING", false),
      typePaths: ["./**/*.graphql"],
      uploads: {
        maxFileSize: 100 * 1024 * 1024, // 100 MiB
        maxFiles: 10,
      },
      definitions: {
        path: join(Config.getRoot(), "src/graphql.schema.ts"),
        outputAs: "class",
      }, /*
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },*/
      installSubscriptionHandlers: true,
      subscriptions: {
        onConnect: (connectionParams: {token?: string}, websocket: WebSocket, context: ConnectionContext) => {
          if (!context.request.hasOwnProperty("cookies") && typeof context.request.headers.cookie === "string") {
            Object.assign(context.request, {cookies: parseCookie(context.request.headers.cookie)});
          }
          Object.assign(context.request, {connectionParams});
          return {req: context.request};
        },
      },
    }),
    TypeOrmModule.forRoot(),
    AttachmentModule,
    AuthModule,
    BalanceModule,
    CacheModule,
    CharacterModule,
    EventModule,
    FileModule,
    FirebaseModule,
    ImplantModule,
    InventoryModule,
    LocationModule,
    MedicineModule,
    MessageModule,
    NewsModule,
    UserModule,
  ],
  providers: [
    DateScalar,
    AppResolvers,
    {
      provide: APP_GUARD,
      useClass: MyGuard,
    },
    {
      provide: "NATS",
      useFactory: () => NATS.connect({url: Config.get("NATS_URL"), json: true}),
    },
  ],
  controllers: [AppController],
  exports: ["NATS"],
})
export class AppModule {}
