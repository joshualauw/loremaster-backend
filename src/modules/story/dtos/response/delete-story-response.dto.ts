import { Expose } from "class-transformer";

export class DeleteStoryResponseDto {
    @Expose()
    storyId: number;
}
