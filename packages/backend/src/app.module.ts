import { Module } from "@nestjs/common";
import { GraphQLModule, GraphQLFactory } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { Config } from "config";
import { Request, Response } from "express";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { CharacterModule } from "character/character.module";
import { UserModule } from "./user/user.module";
import { DateScalar } from "./date.scalar";
import { AppResolvers } from "./app.resolvers";
import { NewsModule } from "./news/news.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "auth/roles.guard";
import { GqlAuthGuard } from "auth/gql-auth.guard";
import { BalanceModule } from "balance/balance.module";
import { AttachmentModule } from "attachment/attachment.module";

@Module({
  imports: [
    GraphQLModule.forRoot({
      context: ({ req, res }: {req: Request, res: Response}) => ({ req, res }),
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
      // installSubscriptionHandlers: true,
    }),
    TypeOrmModule.forRoot(),
    AttachmentModule,
    AuthModule,
    BalanceModule,
    CharacterModule,
    NewsModule,
    UserModule,
  ],
  providers: [
    DateScalar,
    AppResolvers,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
