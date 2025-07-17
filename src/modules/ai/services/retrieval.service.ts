import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PrismaService } from "src/core/database/prisma.service";
import { OpenAIService } from "src/core/llm/openai.service";
import { SearchChunksDto } from "src/modules/ai/dtos/request/search-chunks.dto";
import { SearchChunksResponseDto } from "src/modules/ai/dtos/response/search-chunks-response.dto";
import { RerankingService } from "src/modules/ai/services/reranking.service";
import { SearchOptions } from "src/modules/ai/types/SearchOptions";
import aiConfig from "src/config/ai.config";

@Injectable()
export class RetrievalService {
    constructor(
        private openai: OpenAIService,
        private prisma: PrismaService,
        private reranking: RerankingService,
        @Inject(aiConfig.KEY) private aiCfg: ConfigType<typeof aiConfig>,
    ) {}

    async searchChunks(data: SearchChunksDto): Promise<SearchChunksResponseDto[]> {
        const { documentIds, query } = data;

        const vectors = await this.openai.embedChunks([query]);
        const vector = vectors[0];
        const vectorString = `[${vector.join(",")}]`;
        const totalChunks = this.getMaxChunks(documentIds.length);

        const vectorResult = await this.vectorSearch({
            query: vectorString,
            documentIds,
            threshold: this.aiCfg.vectorSearchThreshold,
            limit: totalChunks,
        });
        const fullTextResult = await this.fullTextSearch({
            query,
            documentIds,
            threshold: this.aiCfg.fullTextSearchThreshold,
            limit: totalChunks,
        });

        const ranked = this.reranking.combineSearchResults(fullTextResult, vectorResult);
        console.log(ranked);

        return ranked;
    }

    async fullTextSearch(options: SearchOptions): Promise<SearchChunksResponseDto[]> {
        const { query, documentIds, threshold, limit } = options;

        return await this.prisma.$queryRaw`
            WITH RankedChunks AS (
                SELECT "documentChunkId", content, index,
                ts_rank(to_tsvector('english', content), plainto_tsquery(${query})) AS score
                FROM public."DocumentChunk"
                WHERE "documentId" = ANY(${documentIds}::int[])
                AND to_tsvector('english', content) @@ plainto_tsquery(${query})
            )
            SELECT "documentChunkId", content, index, score
            FROM RankedChunks
            WHERE score >= ${threshold}
            ORDER BY score DESC
            LIMIT ${limit}
        `;
    }

    async vectorSearch(options: SearchOptions): Promise<SearchChunksResponseDto[]> {
        const { query, documentIds, threshold, limit } = options;

        return await this.prisma.$queryRaw`
            SELECT "documentChunkId", content, index, vector <=> ${query}::vector AS score 
            FROM public."DocumentChunk"
            WHERE "documentId" = ANY(${documentIds}::int[]) 
            AND vector <=> ${query}::vector < ${threshold}
            ORDER BY score
            LIMIT ${limit}
        `;
    }

    //logarithmic growth
    getMaxChunks(documentLength: number) {
        const chunkCount = Math.ceil(
            this.aiCfg.vectorSearchBasechunks + Math.log2(documentLength) * this.aiCfg.vectorSearchGrowthFactor,
        );
        return Math.min(chunkCount, this.aiCfg.vectorSearchMaximumChunks);
    }
}
