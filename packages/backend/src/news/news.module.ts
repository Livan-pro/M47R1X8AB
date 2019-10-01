import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { News } from "matrix-database";
import { NewsService } from "./news.service";
import { NewsResolvers } from "./news.resolvers";
import { AttachmentModule } from "attachment/attachment.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    AttachmentModule,
  ],
  providers: [NewsService, NewsResolvers],
  exports: [NewsService],
})
export class NewsModule {}
