import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Character } from "./character";
import { ImplantType } from "../utils/implant-type.enum";

@Entity("implants")
export class Implant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(type => Character)
  @JoinColumn({name: "characterId"})
  character: Character;

  @Column({nullable: true})
  characterId: number;

  @Column({length: 255})
  name: string;

  @Column("enum", {enum: ImplantType})
  type: ImplantType;

  @Column()
  working: boolean;

  @Column()
  quality: boolean;
}
