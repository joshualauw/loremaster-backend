import { Injectable } from "@nestjs/common";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PrismaService } from "src/core/database/prisma.service";
import { OpenAIService } from "src/core/llm/openai.service";
import { AiRules } from "src/modules/ai/const/rules.const";
import { GenerateSceneDto } from "src/modules/ai/dtos/request/generate-scene.dto";
import { SearchChunksDto } from "src/modules/ai/dtos/request/search-chunks.dto";
import { StoreChunksDto } from "src/modules/ai/dtos/request/store-chunks.dto";
import { SearchChunksResponseDto } from "src/modules/ai/dtos/response/search-chunks-response.dto";

@Injectable()
export class AiService {
    constructor(
        private openai: OpenAIService,
        private prisma: PrismaService,
    ) {}

    cleanText(input: string): string {
        return input
            .replace(/[ \t]+/g, " ") // normalize spaces
            .replace(/\r\n/g, "\n") // unify line breaks
            .replace(/\n{3,}/g, "\n\n") // max 2 newlines (preserve paragraph)
            .replace(/\.{2,}/g, ".") // remove extra dots
            .replace(/[^\x00-\x7F]+/g, "") // optional: remove non-ASCII
            .trim();
    }

    async createChunks(input: string): Promise<string[]> {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: AiRules.SPLIT_CHUNK_OVERLAP,
            chunkOverlap: AiRules.SPLIT_CHUNK_OVERLAP,
            separators: [". ", "\n\n", "\n", " ", ""],
        });

        const output = await splitter.createDocuments([input]);
        return output.map((doc) =>
            doc.pageContent
                .replace(/^\.\s*/, "")
                .replace(/\s+/g, " ")
                .trim(),
        );
    }

    async embedChunks(inputs: string[]): Promise<number[][]> {
        const result = await this.openai.client.embeddings.create({
            model: "text-embedding-3-small",
            input: inputs,
        });

        return result.data.map((d) => d.embedding);
    }

    async searchChunks(data: SearchChunksDto): Promise<SearchChunksResponseDto[]> {
        const { documentIds, query } = data;

        const vectors = await this.embedChunks([query]);
        const vector = vectors[0];
        const vectorString = `[${vector.join(",")}]`;

        const distanceThreshold = AiRules.VECTOR_SEARCH_DISTANCE_THRESHOLD;
        //logarithmic growth
        const maxChunksRetreived = Math.ceil(
            AiRules.VECTOR_SEARCH_BASE_CHUNKS + Math.log2(documentIds.length) * AiRules.VECTOR_SEARCH_GROWTH_FACTOR,
        );
        const topNResult = Math.min(maxChunksRetreived, AiRules.VECTOR_SEARCH_MAX_CHUNKS);

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

    async storeChunks(data: StoreChunksDto) {
        const { documentId, chunks, vectors } = data;

        const values: any[] = [];
        const placeholders: string[] = [];

        for (let i = 0; i < chunks.length; i++) {
            const offset = i * 4;
            values.push(documentId, i, chunks[i], vectors[i]);
            placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);
        }

        const query = `
            INSERT INTO public."DocumentChunk" ("documentId", index, content, vector)
            VALUES ${placeholders.join(", ")}
        `;

        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRawUnsafe(query, ...values);
        });
    }

    async generateScene(data: GenerateSceneDto) {}
}
