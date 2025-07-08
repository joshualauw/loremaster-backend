import { Expose } from "class-transformer";

export class DeleteDocumentResponseDto {
    @Expose()
    documentId: number;
}
