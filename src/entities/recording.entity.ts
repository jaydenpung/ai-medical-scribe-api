import { Entity, Column, ManyToOne } from 'typeorm';
import { Consult } from './consult.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Recording extends BaseEntity {
  @Column()
  transcribedText: string;

  @ManyToOne(() => Consult, consult => consult.recordings)
  consult: Consult;
}