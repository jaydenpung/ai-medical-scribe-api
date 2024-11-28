import { RequestHandler } from "express";
import { Consult } from "../entities/consult.entity";
import { BaseController } from "./base.controller";
import { Service } from "typedi";
import { ConsultService } from "../services/consult.service";
import { RecordingService } from "../services/recording.service";

@Service()
export class ConsultController extends BaseController<Consult> {
  protected entityName = "Consult";

  constructor(
    protected service: ConsultService,
    private recordingService: RecordingService
  ) {
    super();
  }

  createRecording: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const consult = await this.service.findOne(req.params.id);
      if (!consult) {
        res.status(404).json({ message: "Consult not found" });
        return;
      }

      const recording = await this.recordingService.create({
        ...req.body,
        consult: consult,
      });
      res.status(201).json(recording);
    } catch (error) {
      next(error);
    }
  };
}
