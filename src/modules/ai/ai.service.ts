import { Injectable } from "@nestjs/common";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const CHUNK_SIZE = 300;
const CHUNK_OVERLAP = 40;

@Injectable()
export class AiService {
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
            chunkSize: CHUNK_SIZE,
            chunkOverlap: CHUNK_OVERLAP,
            separators: [". ", "\n\n", "\n", " ", ""],
        });

        const output = await splitter.createDocuments([input]);
        return output.map((doc) => this.cleanChunk(doc.pageContent));
    }

    cleanChunk(chunk: string): string {
        return chunk
            .replace(/^\.\s*/, "")
            .replace(/\s+/g, " ")
            .trim();
    }
}
