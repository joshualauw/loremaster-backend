import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import OpenAI from "openai";
import openaiConfig from "src/config/openai.config";

@Injectable()
export class OpenAIService {
    public readonly client: OpenAI;

    constructor(@Inject(openaiConfig.KEY) openaiCfg: ConfigType<typeof openaiConfig>) {
        this.client = new OpenAI({
            apiKey: openaiCfg.apiKey,
        });
    }
}
