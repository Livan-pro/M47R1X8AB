import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";

@Entity("firebaseTokens")
export class FirebaseToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column("varchar", {length: 255, unique: true})
  token: string;

  @ManyToOne(type => User)
  @JoinColumn({name: "userId"})
  user: User;

  @Column("int", {nullable: true})
  userId: number;
}
