import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction, TransactionRepository } from "typeorm";
import { Attachment, AttachmentType, EventType } from "matrix-database";
import { FileUpload } from "graphql-upload";
import { FileService } from "file/file.service";
import { EventService } from "event/event.service";

@Injectable()
export class AttachmentService {
  private readonly log = new Logger(AttachmentService.name);
  constructor(
    @InjectRepository(Attachment)
    private readonly repo: Repository<Attachment>,
    private readonly file: FileService,
    private readonly event: EventService,
  ) {}

  @Transaction()
  async upload(
    filePromise: FileUpload | Promise<FileUpload>,
    type: AttachmentType,
    userId: number,
    @TransactionRepository(Attachment) repo?: Repository<Attachment>,
  ): Promise<Attachment> {
    const file = await filePromise;
    let attachment = repo.create({uploaderId: userId, name: file.filename.substring(0, 255), type});
    attachment = await repo.save(attachment);
    await this.file.upload(file, ["attachments", attachment.id.toString(), attachment.name]);
    await this.event.emit(null, userId, null, null, EventType.UploadAttachment, attachment);
    return attachment;
  }
}
