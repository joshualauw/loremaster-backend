import { zodTextFormat } from "openai/helpers/zod";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PrismaService } from "src/core/database/prisma.service";
import { OpenAIService } from "src/core/llm/openai.service";
import { SearchChunksDto } from "src/modules/ai/dtos/request/search-chunks.dto";
import { SearchChunksResponseDto } from "src/modules/ai/dtos/response/search-chunks-response.dto";
import { SearchOptions } from "src/modules/ai/dtos/common/SearchOptions";
import { ChunkResultItem } from "src/modules/ai/dtos/common/ChunkResultItem";
import { RerankingService } from "src/modules/ai/services/reranking.service";
import { queryExpansionPrompt } from "src/modules/ai/prompts/query-expansion.prompt";
import aiConfig from "src/config/ai.config";
import { QueryExpansion, queryExpansionSchema } from "src/modules/ai/schemas/query-expansion.schema";

@Injectable()
export class RetrievalService {
    constructor(
        private openai: OpenAIService,
        private prisma: PrismaService,
        private reranking: RerankingService,
        @Inject(aiConfig.KEY) private aiCfg: ConfigType<typeof aiConfig>,
    ) {}

    async searchChunks(data: SearchChunksDto): Promise<SearchChunksResponseDto> {
        const { documentIds, rawQuery } = data;
        const totalChunks = this.getMaxChunks(documentIds.length);

        const { vectorFriendlyQuery, fulltextFriendlyQuery } = await this.queryExpansion(rawQuery);

        const vectors = await this.openai.embedChunks([vectorFriendlyQuery]);
        const vector = vectors[0];
        const vectorString = `[${vector.join(",")}]`;

        const [vectorResult, fullTextResult] = await Promise.all([
            this.vectorSearch({
                query: vectorString,
                documentIds,
                threshold: this.aiCfg.vectorSearchThreshold,
                limit: totalChunks,
            }),
            this.fullTextSearch({
                query: fulltextFriendlyQuery,
                documentIds,
                threshold: this.aiCfg.fullTextSearchThreshold,
                limit: totalChunks,
            }),
        ]);

        return this.reranking.combineSearchResults(fullTextResult, vectorResult);
    }

    //logarithmic growth
    getMaxChunks(documentLength: number): number {
        const chunkCount = Math.ceil(
            this.aiCfg.vectorSearchBasechunks + Math.log2(documentLength) * this.aiCfg.vectorSearchGrowthFactor,
        );
        return Math.min(chunkCount, this.aiCfg.vectorSearchMaximumChunks);
    }

    async queryExpansion(query: string): Promise<QueryExpansion> {
        return this.openai.getStructuredResponse(
            queryExpansionPrompt(query),
            zodTextFormat(queryExpansionSchema, "query_expansion"),
        );
    }

    async fullTextSearch(options: SearchOptions): Promise<ChunkResultItem[]> {
        const { query, documentIds, threshold, limit } = options;

        return await this.prisma.$queryRaw`
            WITH RankedChunks AS (
                SELECT "documentChunkId", content, index,
                ts_rank(to_tsvector('english', content), websearch_to_tsquery('english', ${query})) AS score
                FROM public."DocumentChunk"
                WHERE "documentId" = ANY(${documentIds}::int[])
                AND to_tsvector('english', content) @@ websearch_to_tsquery('english', ${query})
            )
            SELECT "documentChunkId", content, index, score
            FROM RankedChunks
            WHERE score > ${threshold}
            ORDER BY score DESC
            LIMIT ${limit}
        `;
    }

    async vectorSearch(options: SearchOptions): Promise<ChunkResultItem[]> {
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
}
