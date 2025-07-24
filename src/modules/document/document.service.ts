import { InjectQueue } from "@nestjs/bullmq";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { QueueKey } from "src/modules/queue/enums/queue.enum";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateDocumentDto } from "src/modules/document/dtos/request/create-document.dto";
import { DeleteDocumentDto } from "src/modules/document/dtos/request/delete-document.dto";
import { UpdateDocumentDto } from "src/modules/document/dtos/request/update-document.dto";
import { CreateDocumentResponseDto } from "src/modules/document/dtos/response/create-document-response.dto";
import { DeleteDocumentResponseDto } from "src/modules/document/dtos/response/delete-document-response.dto";
import { UpdateDocumentResponseDto } from "src/modules/document/dtos/response/update-document-response.dto";
import { ChunkingTaskDto } from "src/modules/queue/dtos/request/chunking-task.dto";
import { pick } from "src/core/utils/mapper";
import { GetAllDocumentDto } from "src/modules/document/dtos/request/get-all-document.dto";
import { GetAllDocumentResponseDto } from "src/modules/document/dtos/response/get-all-document.dto";

@Injectable()
export class DocumentService {
    constructor(
        private prisma: PrismaService,
        @InjectQueue(QueueKey.CHUNKING) private queue: Queue,
    ) {}

    async canChangeDocument(storyId: number, userId: number): Promise<void> {
        const story = await this.prisma.story.findFirstOrThrow({
            where: { storyId },
        });

        if (story.userId != userId) {
            throw new ForbiddenException("User doesn't have permission to access document");
        }
    }

    async getAll(payload: GetAllDocumentDto): Promise<GetAllDocumentResponseDto> {
        const { userId, storyId, categoryId, page, sortBy } = payload;

        await this.canChangeDocument(storyId, userId);

        const limit = 10;
        const offset = (page - 1) * limit;

        const documents = await this.prisma.document.findMany({
            where: {
                storyId,
                ...(categoryId != 0 && { categoryId }),
            },
            include: {
                category: { select: { name: true } },
            },
            orderBy: {
                createdAt: sortBy == "latest" ? "asc" : "desc",
            },
            skip: offset,
            take: limit,
        });

        return documents.map((d) => ({
            ...pick(d, "documentId", "name", "categoryId"),
            categoryName: d.category.name,
        }));
    }

    async create(payload: CreateDocumentDto): Promise<CreateDocumentResponseDto> {
        const { name, fields, userId, storyId, categoryId } = payload;

        await this.canChangeDocument(storyId, userId);

        const newDocument = await this.prisma.document.create({
            data: {
                storyId,
                categoryId,
                originalData: fields,
                name,
            },
        });

        await this.queue.add("chunking", { documentId: newDocument.documentId } as ChunkingTaskDto);

        return pick(newDocument, "documentId", "name", "createdAt", "jobStatus");
    }

    async update(payload: UpdateDocumentDto): Promise<UpdateDocumentResponseDto> {
        const { name, fields, userId, categoryId, documentId } = payload;

        const document = await this.prisma.document.findFirstOrThrow({
            where: { documentId },
        });

        await this.canChangeDocument(document.storyId, userId);

        const updatedDocument = await this.prisma.document.update({
            where: { documentId: document.documentId },
            data: {
                name,
                categoryId,
                originalData: fields,
                jobStatus: "PENDING",
            },
        });

        return pick(updatedDocument, "documentId", "name", "updatedAt", "jobStatus");
    }

    async delete(payload: DeleteDocumentDto): Promise<DeleteDocumentResponseDto> {
        const { userId, documentId } = payload;

        const document = await this.prisma.document.findFirstOrThrow({
            where: { documentId },
        });

        await this.canChangeDocument(document.storyId, userId);

        const deletedDocument = await this.prisma.document.delete({
            where: { documentId },
        });

        return pick(deletedDocument, "documentId");
    }
}
