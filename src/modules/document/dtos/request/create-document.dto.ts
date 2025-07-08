import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateDocumentBody {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    categoryId: number;
}

export type CreateDocumentDto = CreateDocumentBody & {
    storyId: number;
    userId: number;
};
