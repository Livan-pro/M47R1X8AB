import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Character } from "./character";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(type => Character)
  @JoinColumn({name: "fromId"})
  from: Character;

  @Column({nullable: false})
  fromId: number;

  @Column({nullable: false})
  toId: number;

  @Column("text")
  text: string;
}
