import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PrismaService } from "src/core/database/prisma.service";
import { StoreChunksDto } from "src/modules/ai/dtos/request/store-chunks.dto";
import aiConfig from "src/config/ai.config";
import { CreateChunksResponse } from "src/modules/ai/dtos/response/create-chunks-response.dto";
import { OpenAIService } from "src/core/llm/openai.service";

@Injectable()
export class PreprocessingService {
    constructor(
        private prisma: PrismaService,
        private openai: OpenAIService,
        @Inject(aiConfig.KEY) private aiCfg: ConfigType<typeof aiConfig>,
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

    async createChunks(input: string): Promise<CreateChunksResponse> {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: this.aiCfg.splitChunkSize,
            chunkOverlap: this.aiCfg.splitChunkOverlap,
            separators: [". ", "\n\n", "\n", " ", ""],
        });

        const output = await splitter.createDocuments([input]);
        const values = output.map((doc) =>
            doc.pageContent
                .replace(/^\.\s*/, "")
                .replace(/\s+/g, " ")
                .trim(),
        );
        const vectors = await this.openai.embedChunks(values);

        return { vectors, values };
    }

    async storeChunks(data: StoreChunksDto) {
        const { documentId, values, vectors } = data;

        const tempValues: any[] = [];
        const placeholders: string[] = [];

        for (let i = 0; i < values.length; i++) {
            const offset = i * 4;
            tempValues.push(documentId, i, tempValues[i], vectors[i]);
            placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);
        }

        const query = `
            INSERT INTO public."DocumentChunk" ("documentId", index, content, vector)
            VALUES ${placeholders.join(", ")}
        `;

        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRawUnsafe(query, ...tempValues);
        });
    }
}
