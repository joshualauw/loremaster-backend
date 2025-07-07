import { IsString, IsNotEmpty } from "class-validator";

export class UpdateStoryBody {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export type UpdateStoryDto = UpdateStoryBody & {
    storyId: number;
};
