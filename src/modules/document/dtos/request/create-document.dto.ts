import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDocumentBody {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsNotEmpty()
    fields: {
        label: string;
        content: string;
    }[];

    @IsNumber()
    @IsNotEmpty()
    categoryId: number;
}

export type CreateDocumentDto = CreateDocumentBody & {
    storyId: number;
    userId: number;
};
