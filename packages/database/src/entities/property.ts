import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { Character } from "./character";

@Entity("properties")
@Unique(["characterId", "name"])
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(type => Character, (character: Character) => character.properties)
  @JoinColumn({name: "characterId"})
  character: Character;

  @Column({nullable: true})
  characterId: number;

  @Column({length: 255})
  name: string;

  @Column({length: 255})
  value: string;
}
