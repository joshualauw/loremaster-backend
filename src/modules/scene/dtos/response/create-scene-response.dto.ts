import { Expose } from "class-transformer";

export class CreateSceneResponseDto {
    @Expose()
    sceneId: number;

    @Expose()
    createdAt: Date;

    @Expose()
    jobStatus: string;
}
