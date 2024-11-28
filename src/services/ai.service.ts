import { Service } from 'typedi';
import OpenAI from 'openai';
import { ReadStream } from 'fs';

@Service()
export class AiService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async transcribe(audioReadStream: ReadStream): Promise<string> {
        const transcription = await this.openai.audio.transcriptions.create({
            file: audioReadStream,
            model: 'whisper-1',
        });
        return transcription.text;
    }

    async chatCompletion(messages: {role: 'system' | 'user', content: string}[]): Promise<string> {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages,
        });
        return response.choices[0].message.content ?? '';
    }
}
