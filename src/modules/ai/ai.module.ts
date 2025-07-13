import { Module } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { OpenAIService } from "src/core/llm/openai.service";
import { AiService } from "src/modules/ai/ai.service";

@Module({
    providers: [PrismaService, AiService, OpenAIService],
    exports: [AiService],
})
export class AiModule {}
