import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Character } from "./character";

@Entity("itemGifts")
export class ItemGift {
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

  @Column("int", {nullable: false})
  itemId: number;

  @Column("int", {nullable: false, default: 1})
  amount: number;
}
