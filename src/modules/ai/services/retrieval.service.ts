import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PrismaService } from "src/core/database/prisma.service";
import { OpenAIService } from "src/core/llm/openai.service";
import { SearchChunksDto } from "src/modules/ai/dtos/request/search-chunks.dto";
import { SearchChunksResponseDto } from "src/modules/ai/dtos/response/search-chunks-response.dto";
import aiConfig from "src/config/ai.config";
import { VectorSearchDto } from "src/modules/ai/dtos/request/vector-search.dto";
import { FullTextSearchDto } from "src/modules/ai/dtos/request/full-text-search.dto";

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

        //logarithmic growth
        const totalChunks = Math.ceil(
            this.aiCfg.vectorSearchBasechunks + Math.log2(documentIds.length) * this.aiCfg.vectorSearchGrowthFactor,
        );
        const maxChunks = Math.min(totalChunks, this.aiCfg.vectorSearchMaximumChunks);
        const vectorSearchLimit = Math.round(maxChunks * this.aiCfg.vectorSearchChunkWeight);
        const fullTextSearchLimit = Math.round(maxChunks * this.aiCfg.fullTextSearchChunkWeight);

        const vectorResult = await this.vectorSearch({
            vectorString,
            documentIds,
            distanceThreshold: this.aiCfg.vectorSearchDistanceThreshold,
            limit: vectorSearchLimit,
        });
        const fullTextResult = await this.fullTextSearch({
            query,
            documentIds,
            scoreThreshold: this.aiCfg.fullTextSearrchScoreThreshold,
            limit: fullTextSearchLimit,
        });

        console.log("vector", vectorResult);
        console.log("fts", fullTextResult);

        //deduping
        //reranking

        return [...vectorResult, ...fullTextResult];
    }

    async fullTextSearch(params: FullTextSearchDto): Promise<SearchChunksResponseDto[]> {
        const { query, documentIds, scoreThreshold, limit } = params;

        return await this.prisma.$queryRaw`
            WITH RankedChunks AS (
                SELECT "documentChunkId", content, index,
                ts_rank(to_tsvector('english', content), plainto_tsquery(${query})) AS textScore
                FROM public."DocumentChunk"
                WHERE "documentId" = ANY(${documentIds}::int[])
                AND to_tsvector('english', content) @@ plainto_tsquery(${query})
            )
            SELECT "documentChunkId", content, index, textScore
            FROM RankedChunks
            WHERE textScore >= ${scoreThreshold}
            ORDER BY textScore DESC
            LIMIT ${limit}
        `;
    }

    async vectorSearch(params: VectorSearchDto): Promise<SearchChunksResponseDto[]> {
        const { vectorString, documentIds, distanceThreshold, limit } = params;

        return await this.prisma.$queryRaw`
            SELECT "documentChunkId", content, index, vector <=> ${vectorString}::vector AS distance 
            FROM public."DocumentChunk"
            WHERE "documentId" = ANY(${documentIds}::int[]) 
            AND vector <=> ${vectorString}::vector < ${distanceThreshold}
            ORDER BY distance
            LIMIT ${limit}
        `;
    }
    //using normalization
    async rerankingChunks() {}
}
