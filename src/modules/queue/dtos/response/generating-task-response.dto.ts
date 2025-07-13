import { Expose } from "class-transformer";

export class GeneratingTaskResponseDto {
    @Expose()
    documentChunkId: number;

    @Expose()
    content: string;

    @Expose()
    index: number;

    @Expose()
    distance: number;
}
