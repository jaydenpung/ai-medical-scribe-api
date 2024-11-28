import fs, { ReadStream } from "fs";
import path from "path";

export const mockAudio = fs.createReadStream(path.join(__dirname, "audio.wav"));

// pretend to download from s3 into memory or temporary file then return the audio
export const mockGetFileFromS3 = (url: string): ReadStream => {
  return fs.createReadStream(url);
};

// pretend to upload to s3 but is just storing in temporary path
export const mockPutFileToS3 = async (
  consultId: string,
  audio: Buffer
): Promise<string> => {
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const tempFilePath = path.join(tempDir, consultId + ".webm");
  await fs.writeFileSync(tempFilePath, audio);
  return tempFilePath;
};

// pretend to delete from s3 but is just deleting from temporary path
export const mockDeleteS3File = async (consultId: string): Promise<void> => {
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const tempFilePath = path.join(tempDir, consultId + ".webm");
  await fs.unlinkSync(tempFilePath);
};
