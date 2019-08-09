import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { Character } from "./character";

@Entity("balanceHistory")
export class BalanceTransfer {
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

  @ManyToOne(type => Character)
  @JoinColumn({name: "toId"})
  to: Character;

  @Column({nullable: false})
  toId: number;

  @Column("int")
  amount: number;
}
