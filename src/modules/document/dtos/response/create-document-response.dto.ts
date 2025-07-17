import { Document } from "@prisma/client";

export interface CreateDocumentResponseDto extends Pick<Document, "documentId" | "name" | "createdAt" | "jobStatus"> {}
