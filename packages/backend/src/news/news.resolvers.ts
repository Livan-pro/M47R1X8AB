import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { NewsService } from "./news.service";
import { News, NewsInput } from "graphql.schema";
import { UserRole as Role, User } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { GetUser } from "user/get-user.decorator";

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
    @Args("data") data: NewsInput,
    @GetUser() user: User,
  ): Promise<News> {
    return await this.news.create(data, user.id);
  }

  @Mutation("updateNews")
  @Roles(Role.Admin)
  async updateNews(
    @Args("id") id: number,
    @Args("data") data: NewsInput,
    @GetUser() user: User,
  ): Promise<News> {
    await this.news.update(id, data, user.id);
    return this.news.getById(id);
  }

  @Mutation("deleteNews")
  @Roles(Role.Admin)
  async deleteNews(
    @Args("ids") ids: number[],
  ) {
    await this.news.delete(ids);
  }
}
