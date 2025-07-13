import { Expose } from "class-transformer";

export class GeneratingTaskDto {
    @Expose()
    sceneId: number;

    @Expose()
    documentIds: number[];

    @Expose()
    tone: string;

    @Expose()
    description: string;
}
