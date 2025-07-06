import { IsString, IsNotEmpty } from "class-validator";

export class CreateStoryBody {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export type CreateStoryDto = CreateStoryBody & {
    userId: number;
};
