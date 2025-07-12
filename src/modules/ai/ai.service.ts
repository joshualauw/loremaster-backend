import { Injectable } from "@nestjs/common";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIService } from "src/core/llm/openai.service";

@Injectable()
export class AiService {
    constructor(private openai: OpenAIService) {}

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
            chunkSize: 300,
            chunkOverlap: 40,
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

    async dummyEmbedChunks(inputs: string[]): Promise<number[][]> {
        function dummyVector(text: string, dim = 1536): number[] {
            const vector = new Array(dim).fill(0);
            let hash = 0;

            for (let i = 0; i < text.length; i++) {
                hash = (hash * 31 + text.charCodeAt(i)) % 100000;
            }

            for (let i = 0; i < dim; i++) {
                const val = Math.sin(hash + i) * 1000;
                vector[i] = val % 1 || 0;
            }

            return vector;
        }

        return inputs.map((d) => dummyVector(d));
    }
}
