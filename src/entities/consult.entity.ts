import { Entity, Column, OneToMany } from 'typeorm';
import { Recording } from './recording.entity';
import { ConsultStatus } from '../utils/constants';
import { BaseEntity } from './base.entity';

@Entity()
export class Consult extends BaseEntity {
  @Column()
  status: ConsultStatus;

  @Column()
  notes: string;

  @Column({nullable: true})
  result: string;

  @OneToMany(() => Recording, recording => recording.consult)
  recordings: Recording[];
}