import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";
import { Character } from "character/character.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({unique: true})
  email: string;

  @Column("char", {length: 60})
  password: string;

  @Column({nullable: true})
  passwordChangedAt: Date;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column("date")
  birthday: Date;

  @Column({length: 20})
  phone: string;

  @Column({length: 32})
  vkId: string;

  @Column({length: 1000, nullable: true})
  medicalInfo: string;

  @OneToMany(type => Character, character => character.user)
  characters: Character[];
}
