import fs, { ReadStream } from "fs";
import path from "path";

export const mockAudio = fs.createReadStream(path.join(__dirname, "audio.wav"));

export const mockGetFileFromS3 = (url: string): Promise<ReadStream> => {
  // download from s3 into memory or temporary file then return the audio
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAudio);
    }, 1000);
  });
};

export const mockPutFileToS3 = (audio: any): Promise<string> => {
  // upload to s3
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("MOCK_S3_URL");
    }, 1000);
  });
};

export const mockAiTranscribe = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("This is mock transcribed text");
    }, 3000);
  });
};

export const mockAiCompletion = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("This is mock chat completion");
    }, 3000);
  });
};
