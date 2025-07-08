import { Body, Controller, Param, Post } from "@nestjs/common";
import { apiResponse } from "src/core/utils/apiResponse";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { DocumentService } from "src/modules/document/document.service";
import { CreateDocumentBody } from "src/modules/document/dtos/request/create-document.dto";
import { UserJwtPayload } from "src/types/UserJwtPayload";

@Controller("document")
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @Post(":storyId")
    async create(
        @Param("storyId") storyId: number,
        @CurrentUser() user: UserJwtPayload,
        @Body() body: CreateDocumentBody,
    ) {
        const res = await this.documentService.create({ ...body, userId: user.id, storyId });
        return apiResponse("document created", res);
    }
}
