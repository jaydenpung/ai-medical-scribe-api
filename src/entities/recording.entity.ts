import { Entity, Column, ManyToOne } from 'typeorm';
import { Consult } from './consult.entity';
import { BaseEntity } from './base.entity';
import { RecordingStatus } from '../utils/constants';

@Entity()
export class Recording extends BaseEntity {
  @Column()
  transcribedText: string;

  @Column()
  status: RecordingStatus;

  @ManyToOne(() => Consult, consult => consult.recordings)
  consult: Consult;
}