import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { News } from "matrix-database";
import { NewsService } from "./news.service";
import { NewsResolvers } from "./news.resolvers";

@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
  ],
  providers: [NewsService, NewsResolvers],
  exports: [NewsService],
})
export class NewsModule {}
