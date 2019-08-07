import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./user";
import { CharacterRole } from "../utils/character-role.enum";
import { Roles } from "../utils/roles";
import { RolesTransformer } from "../utils/role-transformer";

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

  @Column({nullable: true})
  avatarUploadedAt: Date;

  @Column({type: "int", default: 0, transformer: new RolesTransformer<CharacterRole>(CharacterRole)})
  roles: Roles<CharacterRole>;
}
