import { Module } from "@nestjs/common";
import { OpenAIService } from "src/core/llm/openai.service";
import { AiService } from "src/modules/ai/ai.service";

@Module({
    providers: [AiService, OpenAIService],
    exports: [AiService],
})
export class AiModule {}
