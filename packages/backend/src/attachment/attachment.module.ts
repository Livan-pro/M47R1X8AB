import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attachment } from "matrix-database";
import { AttachmentService } from "./attachment.service";
import { FileModule } from "file/file.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    FileModule,
  ],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
