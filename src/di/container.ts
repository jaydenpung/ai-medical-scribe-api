import { Container } from 'typedi';
import { ConsultService } from '../services/consult.service';
import { RecordingService } from '../services/recording.service';

Container.set('ConsultService', new ConsultService());
Container.set('RecordingService', new RecordingService());