import { Document } from "@prisma/client";

export interface DeleteDocumentResponseDto extends Pick<Document, "documentId"> {}
