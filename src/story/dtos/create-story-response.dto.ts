import { Expose } from "class-transformer";

export class CreateStoryResponseDto {
    @Expose()
    storyId: number;

    @Expose()
    userId: number;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    createdAt: Date;
}
