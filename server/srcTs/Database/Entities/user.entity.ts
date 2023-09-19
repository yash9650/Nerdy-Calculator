import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CalculationEntity } from "./calculation.entity";
import bcrypt from "bcrypt";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: "text",
    nullable: false,
  })
  hash: string;

  @OneToMany(() => CalculationEntity, (calculation) => calculation.user, {
    onDelete: "CASCADE",
  })
  calculations: CalculationEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public validatePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.hash);
  }
}
