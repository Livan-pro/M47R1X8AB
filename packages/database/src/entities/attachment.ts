import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { AttachmentType } from "../utils/attachment-type.enum";
import { User } from "./user";

@Entity("attachments")
export class Attachment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(type => User)
  @JoinColumn({name: "uploaderId"})
  uploader: User;

  @Column({nullable: false})
  uploaderId: number;

  @Column({length: 255})
  name: string;

  @Column("enum", {enum: AttachmentType, nullable: true})
  type: AttachmentType;
}
