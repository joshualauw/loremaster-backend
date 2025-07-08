import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import rulesConfig from "src/config/rules.config";
import { PrismaService } from "src/core/database/prisma.service";
import { mapObject } from "src/core/utils/mapper";
import { CreateDocumentDto } from "src/modules/document/dtos/request/create-document.dto";
import { CreateDocumentResponseDto } from "src/modules/document/dtos/response/create-document-response.dto";

@Injectable()
export class DocumentService {
    constructor(
        private prisma: PrismaService,
        @Inject(rulesConfig.KEY) private rules: ConfigType<typeof rulesConfig>,
    ) {}

    async canChangeDocument(ownerId: number, userId: number) {
        await this.prisma.user.findFirstOrThrow({
            where: { userId },
        });

        if (ownerId != userId) {
            throw new ForbiddenException("User doesn't have permission to access document");
        }
    }

    async create(payload: CreateDocumentDto): Promise<CreateDocumentResponseDto> {
        const { name, content, userId, storyId, categoryId } = payload;

        if (content.length > this.rules.maxCharacterPerDocument) {
            throw new BadRequestException(`Exceed content character limit of ${this.rules.maxCharacterPerDocument}`);
        }

        const story = await this.prisma.story.findFirstOrThrow({
            where: { storyId },
        });

        await this.canChangeDocument(story.userId, userId);

        const newDocument = await this.prisma.document.create({
            data: {
                storyId,
                categoryId,
                name,
                content,
            },
        });

        return mapObject(CreateDocumentResponseDto, newDocument);
    }
}
