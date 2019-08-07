import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { NewsService } from "./news.service";
import { News } from "graphql.schema";
import { UserRole as Role } from "matrix-database";
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

  @Mutation("createNews")
  @Roles(Role.Admin)
  async createNews(
    @Args("data") data: News,
  ): Promise<News> {
    return await this.news.create(data);
  }

  @Mutation("updateNews")
  @Roles(Role.Admin)
  async updateNews(
    @Args("id") id: number,
    @Args("data") data: News,
  ) {
    await this.news.update(id, data);
  }

  @Mutation("deleteNews")
  @Roles(Role.Admin)
  async deleteNews(
    @Args("ids") ids: number[],
  ) {
    await this.news.delete(ids);
  }
}
