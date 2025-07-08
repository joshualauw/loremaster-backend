import { Expose } from "class-transformer";

export class CreateDocumentResponseDto {
    @Expose()
    documentId: number;

    @Expose()
    name: string;

    @Expose()
    createdAt: Date;

    @Expose()
    jobStatus: string;
}
