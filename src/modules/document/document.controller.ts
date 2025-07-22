import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { apiResponse } from "src/core/utils/apiResponse";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { DocumentService } from "src/modules/document/document.service";
import { CreateDocumentBody } from "src/modules/document/dtos/request/create-document.dto";
import { UpdateDocumentBody } from "src/modules/document/dtos/request/update-document.dto";
import { CreateDocumentResponseDto } from "src/modules/document/dtos/response/create-document-response.dto";
import { DeleteDocumentResponseDto } from "src/modules/document/dtos/response/delete-document-response.dto";
import { UpdateDocumentResponseDto } from "src/modules/document/dtos/response/update-document-response.dto";
import { ApiResponse } from "src/types/ApiResponse";
import { UserJwtPayload } from "src/types/UserJwtPayload";

@Controller("document")
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @Post(":storyId")
    async create(
        @Param("storyId") storyId: number,
        @CurrentUser() user: UserJwtPayload,
        @Body() body: CreateDocumentBody,
    ): Promise<ApiResponse<CreateDocumentResponseDto>> {
        const res = await this.documentService.create({ ...body, userId: user.id, storyId });
        return apiResponse("document created", res);
    }

    @Put(":documentId")
    async update(
        @Param("documentId") documentId: number,
        @CurrentUser() user: UserJwtPayload,
        @Body() body: UpdateDocumentBody,
    ): Promise<ApiResponse<UpdateDocumentResponseDto>> {
        const res = await this.documentService.update({ ...body, userId: user.id, documentId });
        return apiResponse("document updated", res);
    }

    @Delete(":documentId")
    async delete(
        @Param("documentId") documentId: number,
        @CurrentUser() user: UserJwtPayload,
    ): Promise<ApiResponse<DeleteDocumentResponseDto>> {
        const res = await this.documentService.delete({ userId: user.id, documentId });
        return apiResponse("document deleted", res);
    }
}
