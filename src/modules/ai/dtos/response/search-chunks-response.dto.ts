import { ChunkResultItem } from "src/modules/ai/dtos/common/ChunkResultItem";

export interface SearchChunksResponseDto {
    vectorResult: ChunkResultItem[];
    fullTextResult: ChunkResultItem[];
}
