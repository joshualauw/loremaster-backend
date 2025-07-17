import { Document } from "@prisma/client";

export interface UpdateDocumentResponseDto extends Pick<Document, "documentId" | "name" | "updatedAt" | "jobStatus"> {}
