import { Resolver, Query } from "@nestjs/graphql";
import { Logger, UseGuards } from "@nestjs/common";
import { NewsService } from "./news.service";
import { GqlAuthGuard } from "auth/gql-auth.guard";
import { News } from "graphql.schema";

@Resolver()
@UseGuards(GqlAuthGuard)
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
