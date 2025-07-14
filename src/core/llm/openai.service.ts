import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import OpenAI from "openai";
import openaiConfig from "src/config/openai.config";

@Injectable()
export class OpenAIService {
    private readonly client: OpenAI;

    constructor(@Inject(openaiConfig.KEY) private openaiCfg: ConfigType<typeof openaiConfig>) {
        this.client = new OpenAI({
            apiKey: openaiCfg.apiKey,
        });
    }

    async embedChunks(inputs: string[]): Promise<number[][]> {
        const result = await this.client.embeddings.create({
            model: this.openaiCfg.embeddingModel,
            input: inputs,
        });

        return result.data.map((d) => d.embedding);
    }
}
