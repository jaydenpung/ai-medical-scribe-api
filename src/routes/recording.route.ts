import { Router } from 'express';
import { RecordingController } from '../controllers/recording.controller';
import Container from 'typedi';

const router = Router();
const controller = Container.get(RecordingController);

router.post('/', controller.create.bind(controller));
router.get('/', controller.findAll.bind(controller));

export default router;