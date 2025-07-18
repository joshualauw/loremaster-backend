import { zodTextFormat } from "openai/helpers/zod";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PrismaService } from "src/core/database/prisma.service";
import { OpenAIService } from "src/core/llm/openai.service";
import { SearchChunksDto } from "src/modules/ai/dtos/request/search-chunks.dto";
import { SearchChunksResponseDto } from "src/modules/ai/dtos/response/search-chunks-response.dto";
import { SearchOptions } from "src/modules/ai/types/SearchOptions";
import { ChunkResultItem } from "src/modules/ai/dtos/common/ChunkResultItem";
import aiConfig from "src/config/ai.config";
import z from "zod";

const queryExpansionSchema = z.object({
    vectorFriendlyQuery: z.string(),
    fulltextFriendlyQuery: z.string(),
});

type QueryExpansion = z.infer<typeof queryExpansionSchema>;

@Injectable()
export class RetrievalService {
    constructor(
        private openai: OpenAIService,
        private prisma: PrismaService,
        @Inject(aiConfig.KEY) private aiCfg: ConfigType<typeof aiConfig>,
    ) {}

    async searchChunks(data: SearchChunksDto): Promise<SearchChunksResponseDto> {
        const { documentIds, vectorQuery, fulltextQuery } = data;
        const totalChunks = this.getMaxChunks(documentIds.length);

        const vectors = await this.openai.embedChunks([vectorQuery]);
        const vector = vectors[0];
        const vectorString = `[${vector.join(",")}]`;

        const vectorResult = await this.vectorSearch({
            query: vectorString,
            documentIds,
            threshold: this.aiCfg.vectorSearchThreshold,
            limit: totalChunks,
        });
        const fullTextResult = await this.fullTextSearch({
            query: fulltextQuery,
            documentIds,
            threshold: this.aiCfg.fullTextSearchThreshold,
            limit: totalChunks,
        });
        console.log("vectorQuery", vectorQuery);
        console.log("ftsQuery", fulltextQuery);
        console.log("vector", vectorResult);
        console.log("fts", fullTextResult);

        return { vectorResult, fullTextResult };
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

    //logarithmic growth
    getMaxChunks(documentLength: number) {
        const chunkCount = Math.ceil(
            this.aiCfg.vectorSearchBasechunks + Math.log2(documentLength) * this.aiCfg.vectorSearchGrowthFactor,
        );
        return Math.min(chunkCount, this.aiCfg.vectorSearchMaximumChunks);
    }

    async queryExpansion(query: string) {
        return this.openai.getStructuredResponse<QueryExpansion>(
            `
            Query: ${query.toLowerCase()}
            Convert this user query into two optimized formats for different search systems:  
            
            vectorFriendlyQuery: 
            - Use natural, descriptive language that captures semantic meaning
            - Focus on concepts, emotions, and context
            - Write as if describing the scene/concept to someone
            - Good for embedding similarity matching      

            fulltextFriendlyQuery:
            - Use specific keywords, exact terms, and phrases
            - Focus on searchable words that would appear in documents
            - Remove articles (a, an, the) and connecting words
            - Good for exact text matching     

            Example:
            Query: "how to fix authentication errors in react apps"
            vectorFriendlyQuery: "troubleshooting authentication problems react application development"
            fulltextFriendlyQuery: "authentication error react fix troubleshoot"

            RETURN ALL VALUES AS LOWERCASE
        `,
            zodTextFormat(queryExpansionSchema, "query_expansion"),
        );
    }
}
