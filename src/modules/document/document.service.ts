import { BadRequestException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import rulesConfig from "src/config/rules.config";
import { PrismaService } from "src/core/database/prisma.service";
import { mapObject } from "src/core/utils/mapper";
import { CreateDocumentDto } from "src/modules/document/dtos/request/create-document.dto";
import { DeleteDocumentDto } from "src/modules/document/dtos/request/delete-document.dto";
import { UpdateDocumentDto } from "src/modules/document/dtos/request/update-document.dto";
import { CreateDocumentResponseDto } from "src/modules/document/dtos/response/create-document-response.dto";
import { DeleteDocumentResponseDto } from "src/modules/document/dtos/response/delete-document-response.dto";
import { UpdateDocumentResponseDto } from "src/modules/document/dtos/response/update-document-response.dto";

@Injectable()
export class DocumentService {
    constructor(
        private prisma: PrismaService,
        @Inject(rulesConfig.KEY) private rulesCfg: ConfigType<typeof rulesConfig>,
    ) {}

    async canChangeDocument(storyId: number, userId: number, contentLength?: number) {
        if (contentLength && contentLength > this.rulesCfg.maxCharacterPerDocument) {
            throw new BadRequestException(`Exceed content character limit of ${this.rulesCfg.maxCharacterPerDocument}`);
        }

        const story = await this.prisma.story.findFirstOrThrow({
            where: { storyId },
        });

        if (story.userId != userId) {
            throw new ForbiddenException("User doesn't have permission to access document");
        }
    }

    async create(payload: CreateDocumentDto): Promise<CreateDocumentResponseDto> {
        const { name, content, userId, storyId, categoryId } = payload;

        await this.canChangeDocument(storyId, userId, content.length);

        const newDocument = await this.prisma.document.create({
            data: {
                storyId,
                categoryId,
                name,
                content,
            },
        });

        //queue to redis processChunks

        return mapObject(CreateDocumentResponseDto, newDocument);
    }

    async update(payload: UpdateDocumentDto): Promise<UpdateDocumentResponseDto> {
        const { name, content, userId, categoryId, documentId } = payload;

        const document = await this.prisma.document.findFirstOrThrow({
            where: { documentId },
        });

        await this.canChangeDocument(document.storyId, userId, content.length);

        const updatedDocument = await this.prisma.document.update({
            where: { documentId: document.documentId },
            data: {
                name,
                content,
                categoryId,
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
