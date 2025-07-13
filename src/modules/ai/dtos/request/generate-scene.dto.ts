import { SearchChunksResponseDto } from "src/modules/ai/dtos/response/search-chunks-response.dto";

export interface GenerateSceneDto {
    chunks: SearchChunksResponseDto[];
    tone: string;
    description: string;
}
