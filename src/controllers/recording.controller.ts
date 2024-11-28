import { Service } from "typedi";
import { Recording } from "../entities/recording.entity";
import { RecordingService } from "../services/recording.service";
import { BaseController } from "./base.controller";

@Service()
export class RecordingController extends BaseController<Recording> {
    protected entityName = 'Recording';

    constructor(
        protected service: RecordingService
    ) {
        super();
    }
}