import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Character } from "./character";

@Entity("medicines")
export class Medicine {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column("binary", {length: 8, unique: true})
  code: Buffer;

  @ManyToOne(type => Character)
  @JoinColumn({name: "usedById"})
  usedBy: Character;

  @Column({nullable: true})
  usedById: number;

  @Column({nullable: true})
  usedAt: Date;
}
