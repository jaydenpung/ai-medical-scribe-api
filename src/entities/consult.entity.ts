import { Entity, Column, OneToMany } from "typeorm";
import { Recording } from "./recording.entity";
import { ConsultStatus } from "../utils/constants";
import { BaseEntity } from "./base.entity";

@Entity()
export class Consult extends BaseEntity {
  @Column({ default: ConsultStatus.CREATED })
  status: ConsultStatus;

  @Column({ nullable: true })
  notes: string;

  @Column("text", { nullable: true })
  result: string;

  @OneToMany(() => Recording, (recording) => recording.consult, {
    onDelete: "CASCADE",
  })
  recordings: Recording[];
}
