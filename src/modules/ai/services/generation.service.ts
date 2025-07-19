import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { OpenAIService } from "src/core/llm/openai.service";
import { GenerateSceneDto } from "src/modules/ai/dtos/request/generate-scene.dto";
import { sceneGenerationPrompt } from "src/modules/ai/prompts/scene-generation.prompt";

@Injectable()
export class GenerationService {
    constructor(
        private prisma: PrismaService,
        private openai: OpenAIService,
    ) {}

    async generateScene(payload: GenerateSceneDto) {
        const { chunks, options } = payload;
        const chunksContent = chunks.map((c) => c.content);

        return await this.openai.getResponse(sceneGenerationPrompt(chunksContent, options, 2000));
    }
}
