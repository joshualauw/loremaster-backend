import { IsNotEmpty, IsArray, IsString } from "class-validator";

export class CreateSceneBody {
    @IsArray()
    documentIds: number[];

    @IsString()
    @IsNotEmpty()
    tone: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export type CreateSceneDto = CreateSceneBody & {
    storyId: number;
    userId: number;
};
