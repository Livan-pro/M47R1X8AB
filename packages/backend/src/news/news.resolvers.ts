import { Resolver, Query } from "@nestjs/graphql";
import { Logger, UseGuards } from "@nestjs/common";
import { NewsService } from "./news.service";
import { News } from "graphql.schema";
import { Role } from "matrix-database";
import { Roles } from "auth/roles.decorator";

@Resolver()
@Roles(Role.LoggedIn)
export class NewsResolvers {
  private readonly log = new Logger(NewsResolvers.name);
  constructor(
    private readonly news: NewsService,
  ) {}

  @Query("news")
  async getNews(): Promise<News[]> {
    return await this.news.getAll();
  }
}
