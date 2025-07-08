import { Expose } from "class-transformer";

export class UpdateStoryResponseDto {
    @Expose()
    storyId: number;

    @Expose()
    userId: number;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    updatedAt: Date;
}
