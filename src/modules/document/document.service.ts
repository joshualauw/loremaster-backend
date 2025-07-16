import { InjectQueue } from "@nestjs/bullmq";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { QueueKey } from "src/modules/queue/enums/queue.enum";
import { PrismaService } from "src/core/database/prisma.service";
import { mapObject } from "src/core/utils/mapper";
import { CreateDocumentDto } from "src/modules/document/dtos/request/create-document.dto";
import { DeleteDocumentDto } from "src/modules/document/dtos/request/delete-document.dto";
import { UpdateDocumentDto } from "src/modules/document/dtos/request/update-document.dto";
import { CreateDocumentResponseDto } from "src/modules/document/dtos/response/create-document-response.dto";
import { DeleteDocumentResponseDto } from "src/modules/document/dtos/response/delete-document-response.dto";
import { UpdateDocumentResponseDto } from "src/modules/document/dtos/response/update-document-response.dto";
import { ChunkingTaskDto } from "src/modules/queue/dtos/request/chunking-task.dto";

@Injectable()
export class DocumentService {
    constructor(
        private prisma: PrismaService,
        @InjectQueue(QueueKey.CHUNKING) private queue: Queue,
    ) {}

    async canChangeDocument(storyId: number, userId: number) {
        const story = await this.prisma.story.findFirstOrThrow({
            where: { storyId },
        });

        if (story.userId != userId) {
            throw new ForbiddenException("User doesn't have permission to access document");
        }
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

        await this.queue.add("chunking", mapObject(ChunkingTaskDto, { documentId: newDocument.documentId }));

        return mapObject(CreateDocumentResponseDto, newDocument);
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

        return mapObject(UpdateDocumentResponseDto, updatedDocument);
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

        return mapObject(DeleteDocumentResponseDto, deletedDocument);
    }
}
