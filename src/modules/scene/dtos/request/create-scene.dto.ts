import { IsNotEmpty, IsArray, IsString, IsOptional } from "class-validator";

export class CreateSceneBody {
    @IsArray()
    documentIds: number[];

    @IsString()
    tone: string;

    @IsString()
    atmosphere: string;

    @IsString()
    conflict: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export type CreateSceneDto = CreateSceneBody & {
    storyId: number;
    userId: number;
};
