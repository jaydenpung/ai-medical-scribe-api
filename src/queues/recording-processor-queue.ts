import amqp from "amqplib";
import { z } from "zod";
import { mockGetFileFromS3 } from "../mock";
import { AiService } from "../services/ai.service";
import { RecordingService } from "../services/recording.service";
import { ConsultService } from "../services/consult.service";
import { ConsultStatus, RecordingStatus } from "../utils/constants";

const QUEUE_CONNECTING_STRING = "amqp://guest:guest@localhost:5672";
const QUEUE_NAME = "process_recording_queue";

const aiService = new AiService();
const recordingService = new RecordingService();
const consultService = new ConsultService();

export const QueuePayloadSchema = z.object({
  uploadedAudioUrl: z.string(),
  consultId: z.string(),
});
export type QueuePayload = z.infer<typeof QueuePayloadSchema>;

async function publishToQueue(message: string): Promise<void> {
  const connection = await amqp.connect(QUEUE_CONNECTING_STRING);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME);
  await channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
  await channel.close();
  await connection.close();
}

async function consumeFromQueue(): Promise<void> {
  const connection = await amqp.connect(QUEUE_CONNECTING_STRING);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME);
  channel.consume(QUEUE_NAME, async (msg) => {
    try {
      if (msg !== null) {
        console.log(`Received message: ${msg.content.toString()}`);
        channel.ack(msg);

        const payload = QueuePayloadSchema.parse(
          JSON.parse(msg.content.toString())
        );

        // make sure consult exist
        let consult = await consultService.findOne(payload.consultId);

        if (!consult) {
          throw new Error("Consult not found");
        }

        // Mock download from S3 to memory or a temporary directory
        const audio = await mockGetFileFromS3(payload.uploadedAudioUrl);

        // transcribe the audio
        const transcribedText = await aiService.transcribe(audio);

        // save the recording
        const addedRecording = await recordingService.create({
          transcribedText,
          consult,
          status: RecordingStatus.TRANSCRIBE_FINISHED,
        });
        console.log("Recording saved");

        // check if consult stopped recording and all recordings are transcribed
        const allRecordingsTranscribed = consult.recordings.every(
          (recording) => {
            return recording.status === RecordingStatus.TRANSCRIBE_FINISHED;
          }
        );
        if (
          consult.status === ConsultStatus.RECORDING_FINISHED &&
          allRecordingsTranscribed
        ) {
          console.log("All recordings transcribed, updating consult status");
          const consultationNote = await aiService.chatCompletion([
            {
              role: "system",
              content:
                "You are a consultation note-taking application. User will provide notes, followed by conversation. Generate a consultation note based on the conversation, and notes",
            },
            {
              role: "user",
              content: `
                Notes: ${consult.notes}
                Conversation: ${[
                  ...consult.recordings.sort((a, b) => a.sequence - b.sequence),
                  addedRecording,
                ]
                  .map((recording) => recording.transcribedText)
                  .join(" ")}
                `,
            },
          ]);
          // update consult status
          await consultService.update(consult.id, {
            result: consultationNote,
            status: ConsultStatus.PROCESSING_COMPLETED,
          });
          //TODO: possible to convert this part to just update status to READY_FOR_PROCESSING. Then another endpoint to stream result of chat completion
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
}

export { publishToQueue, consumeFromQueue };
