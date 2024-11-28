import { Router } from 'express';
import { ConsultController } from '../controllers/consult.controller';
import Container from 'typedi';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
const controller = Container.get(ConsultController);

router.post('/', controller.create.bind(controller));

router.post('/:id/recordings', upload.single('audio'), controller.createRecording.bind(controller));
router.get('/:id/result', controller.getResult.bind(controller));

router.get('/:id', controller.findOne.bind(controller));
router.patch('/:id', controller.update.bind(controller));

export default router;