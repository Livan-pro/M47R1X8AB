import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("news")
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({length: 255})
  title: string;

  @Column({length: 2048})
  text: string;

  @Column()
  datetime: Date;
}
