import { Expose } from "class-transformer";

export class ChunkingTaskDto {
    @Expose()
    documentId: number;
}
