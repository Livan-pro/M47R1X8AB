import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./user";
import { CharacterRole } from "../utils/character-role.enum";
import { Roles } from "../utils/roles";
import { RolesTransformer } from "../utils/role-transformer";
import { Profession } from "../utils/profession.enum";
import { CharacterState } from "../utils/character-state.enum";
import { Location } from "./location";

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

  @Column({type: "int", default: 0, transformer: new RolesTransformer<typeof CharacterRole>(CharacterRole)})
  roles: Roles<typeof CharacterRole>;

  @Column("enum", {enum: Profession, default: Profession.None})
  registrationProfession: Profession;

  @Column("enum", {enum: Profession, default: Profession.None})
  profession: Profession;

  @Column("int", {default: 0})
  professionLevel: number;

  @Column({type: "int", default: 0})
  balance: number;

  @Column("enum", {enum: CharacterState, default: CharacterState.Normal})
  state: CharacterState;

  @Column({nullable: true})
  deathTime: Date;

  @Column("tinyint", {default: 0})
  pollution: number;

  @Column({nullable: true})
  pollutionStartTime: Date;

  @Column({nullable: true})
  implantsRejectTime: Date;

  @ManyToOne(type => Location)
  @JoinColumn({name: "locationId"})
  location: Location;

  @Column({nullable: true})
  locationId: number;
}
