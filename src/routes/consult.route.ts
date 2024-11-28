import { Router } from 'express';
import { ConsultController } from '../controllers/consult.controller';
import Container from 'typedi';

const router = Router();
const controller = Container.get(ConsultController);

router.post('/', controller.create.bind(controller));
router.get('/:id', controller.findOne.bind(controller));
router.patch('/:id', controller.update.bind(controller));

router.post('/:id/recordings', controller.createRecording.bind(controller));

export default router;