import { BaseService } from './base.service';
import { Consult } from '../entities/consult.entity';
import { AppDataSource } from '../config/database';
import { Service } from 'typedi';

@Service()
export class ConsultService extends BaseService<Consult> {
   protected repository = AppDataSource.getRepository(Consult);
   protected relations = ['recordings'];
}
