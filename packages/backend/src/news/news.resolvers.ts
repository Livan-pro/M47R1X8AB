import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { NewsService } from "./news.service";
import { News, NewsInput } from "graphql.schema";
import { UserRole as Role, User, CharacterState, EventType } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { GetUser } from "user/get-user.decorator";
import { EventService } from "event/event.service";

@Resolver()
@Roles({user: Role.LoggedIn})
export class NewsResolvers {
  private readonly log = new Logger(NewsResolvers.name);
  constructor(
    private readonly news: NewsService,
    private readonly event: EventService,
  ) {}

  @Query("news")
  @Roles({user: Role.Admin}, {state: [CharacterState.Normal, CharacterState.Pollution]})
  async getNews(): Promise<News[]> {
    return await this.news.getAll();
  }

  @Mutation("createNews")
  @Roles({user: Role.Admin})
  async createNews(
    @Args("data") data: NewsInput,
    @GetUser() user: User,
  ): Promise<News> {
    const news = await this.news.create(data, user.id);
    await this.event.emit(null, user.id, null, null, EventType.CreateNews, news);
    return news;
  }

  @Mutation("updateNews")
  @Roles({user: Role.Admin})
  async updateNews(
    @Args("id") id: number,
    @Args("data") data: NewsInput,
    @GetUser() user: User,
  ): Promise<News> {
    await this.news.update(id, data, user.id);
    await this.event.emit(null, user.id, null, null, EventType.UpdateNews, {id, ...data});
    return this.news.getById(id);
  }

  @Mutation("deleteNews")
  @Roles({user: Role.Admin})
  async deleteNews(
    @Args("ids") ids: number[],
    @GetUser() user: User,
  ) {
    await this.news.delete(ids);
    await this.event.emit(null, user.id, null, null, EventType.DeleteNews, {ids});
  }
}
