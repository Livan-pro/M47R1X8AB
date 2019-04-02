import { Column, Entity, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "../user/user.entity";

@Entity("characters")
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(type => User, user => user.characters)
  @JoinColumn({name: "userId"})
  user: User;

  @Column({nullable: false})
  userId: number;

  @Column({length: 255})
  name: string;

  @Column("int")
  age: number;

  @Column({nullable: true})
  quenta: string;
}
