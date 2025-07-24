import { Document } from "@prisma/client";

export interface GetAllDocumentResponseDto
    extends Array<Pick<Document, "documentId" | "name" | "categoryId"> & { categoryName: string }> {}
