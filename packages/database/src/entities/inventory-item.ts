import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Character } from "./character";

@Entity("inventoryItems")
export class InventoryItem {
  @ManyToOne(type => Character)
  @JoinColumn({name: "characterId"})
  character: Character;

  @PrimaryColumn("int", {nullable: false})
  characterId: number;

  @PrimaryColumn("int", {nullable: false})
  itemId: number;

  @Column("int", {nullable: false, default: 0})
  amount: number;
}
