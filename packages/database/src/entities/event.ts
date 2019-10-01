import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Character } from "./character";
import { User } from "./user";
import { EventType } from "../utils/event-type.enum";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(type => Character)
  @JoinColumn({name: "causedByCharacterId"})
  causedByCharacter: Character;

  @Column({nullable: true})
  causedByCharacterId: number;

  @ManyToOne(type => User)
  @JoinColumn({name: "causedByUserId"})
  causedByUser: User;

  @Column({nullable: true})
  causedByUserId: number;

  @ManyToOne(type => Character)
  @JoinColumn({name: "affectedCharacterId"})
  affectedCharacter: Character;

  @Column({nullable: true})
  affectedCharacterId: number;

  @ManyToOne(type => User)
  @JoinColumn({name: "affectedUserId"})
  affectedUser: User;

  @Column({nullable: true})
  affectedUserId: number;

  @Column("enum", {enum: EventType})
  type: EventType;

  @Column("json", {nullable: true})
  data: object;
}
