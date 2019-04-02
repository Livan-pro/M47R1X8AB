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

@Module({
  imports: [
    GraphQLModule.forRoot({
      context: ({ req, res }: {req: Request, res: Response}) => ({ req, res }),
      tracing: Config.getBoolean("GRAPHQL_TRACING", false),
      typePaths: ["./**/*.graphql"],
      uploads: true,
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
    AuthModule,
    CharacterModule,
    UserModule,
  ],
  providers: [DateScalar],
  controllers: [AppController],
})
export class AppModule {}
