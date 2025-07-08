import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class UpdateDocumentBody {
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

export type UpdateDocumentDto = UpdateDocumentBody & {
    documentId: number;
    userId: number;
};
