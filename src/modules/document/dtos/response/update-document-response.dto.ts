import { Expose } from "class-transformer";

export class UpdateDocumentResponseDto {
    @Expose()
    documentId: number;

    @Expose()
    name: string;

    @Expose()
    updatedAt: Date;

    @Expose()
    jobStatus: string;
}
