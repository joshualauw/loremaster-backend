import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateDocumentBody {
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

export type UpdateDocumentDto = UpdateDocumentBody & {
    documentId: number;
    userId: number;
};
