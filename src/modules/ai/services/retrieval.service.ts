import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PrismaService } from "src/core/database/prisma.service";
import { OpenAIService } from "src/core/llm/openai.service";
import { SearchChunksDto } from "src/modules/ai/dtos/request/search-chunks.dto";
import { SearchChunksResponseDto } from "src/modules/ai/dtos/response/search-chunks-response.dto";
import aiConfig from "src/config/ai.config";

@Injectable()
export class RetrievalService {
    constructor(
        private openai: OpenAIService,
        private prisma: PrismaService,
        @Inject(aiConfig.KEY) private aiCfg: ConfigType<typeof aiConfig>,
    ) {}

    async searchChunks(data: SearchChunksDto): Promise<SearchChunksResponseDto[]> {
        const { documentIds, query } = data;

        const vectors = await this.openai.embedChunks([query]);
        const vector = vectors[0];
        const vectorString = `[${vector.join(",")}]`;

        const distanceThreshold = this.aiCfg.vectorSearchDistanceThreshold;
        //logarithmic growth
        const maxChunksRetreived = Math.ceil(
            this.aiCfg.vectorSearchBasechunks + Math.log2(documentIds.length) * this.aiCfg.vectorSearchGrowthFactor,
        );
        const topNResult = Math.min(maxChunksRetreived, this.aiCfg.vectorSearchMaximumChunks);

        const result = (await this.prisma.$queryRaw`
                SELECT "documentChunkId", content, index, vector <=> ${vectorString}::vector AS distance 
                FROM public."DocumentChunk"
                WHERE "documentId" = ANY(${documentIds}::int[]) 
                AND vector <=> ${vectorString}::vector < ${distanceThreshold}
                ORDER BY distance
                LIMIT ${topNResult}
            `) as SearchChunksResponseDto[];

        return result;
    }

    async rerankingChunks() {}
}
