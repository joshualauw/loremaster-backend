import { Module } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { OpenAIService } from "src/core/llm/openai.service";
import { GenerationService } from "src/modules/ai/services/generation.service";
import { PreprocessingService } from "src/modules/ai/services/preprocessing.service";
import { RerankingService } from "src/modules/ai/services/reranking.service";
import { RetrievalService } from "src/modules/ai/services/retrieval.service";

@Module({
    providers: [
        PrismaService,
        PreprocessingService,
        RetrievalService,
        RerankingService,
        GenerationService,
        OpenAIService,
    ],
    exports: [PreprocessingService, RetrievalService, GenerationService, RerankingService],
})
export class AiModule {}
