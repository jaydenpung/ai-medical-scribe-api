import { RequestHandler } from "express";
import { Consult } from "../entities/consult.entity";
import { BaseController } from "./base.controller";
import { Service } from "typedi";
import { ConsultService } from "../services/consult.service";
import { mockDeleteS3File, mockPutFileToS3 } from "../mock";
import { publishToQueue } from "../queues/recording-processor-queue";
import { ConsultStatus } from "../utils/constants";

@Service()
export class ConsultController extends BaseController<Consult> {
  protected entityName = "Consult";

  constructor(protected service: ConsultService) {
    super();
  }

  createConsultRecording: RequestHandler = async (
    req,
    res,
    next
  ): Promise<void> => {
    try {
      const consult = await this.service.findOne(req.params.id);
      if (!consult) {
        res.status(404).json({ message: "Consult not found" });
        return;
      }

      if (!req.file?.buffer) {
        res.status(400).json({ message: "Audio file is required" });
        return;
      }

      // if there is notes, it means the recording is finished
      if (req.body.notes) {
        await this.service.update(consult.id, {
          status: ConsultStatus.RECORDING_FINISHED,
          notes: req.body.notes,
        });
      }

      // mock uploaded to S3
      const uploadedAudioUrl = await mockPutFileToS3(
        consult.id,
        req.file?.buffer
      );

      // publish to queue for processing
      await publishToQueue(
        JSON.stringify({
          uploadedAudioUrl,
          consultId: consult.id,
        })
      );

      res.status(201).json({});
    } catch (error) {
      next(error);
    }
  };

  // a long polling endpoint to get the result of the consult
  getResult: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const interval = setInterval(async () => {
        const consult = await this.service.findOne(req.params.id);
        if (consult?.status === ConsultStatus.PROCESSING_COMPLETED) {
          clearInterval(interval);
          res.status(200).json(consult);

          // delete consult and recordings
          mockDeleteS3File(consult.id);
          await this.service.delete(consult.id);
        }
      }, 2000); // Check every 2 second
    } catch (error) {
      next(error);
    }
  };
}
