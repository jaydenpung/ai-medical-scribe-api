import { BaseService } from './base.service';
import { Recording } from '../entities/recording.entity';
import { AppDataSource } from '../config/database';
import { Service } from 'typedi';

@Service()
export class RecordingService extends BaseService<Recording> {
   protected repository = AppDataSource.getRepository(Recording);
   protected relations = ['consult'];
}
