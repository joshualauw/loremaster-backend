import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";
import { apiResponse } from "src/core/utils/apiResponse";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { DocumentService } from "src/modules/document/document.service";
import { CreateDocumentBody } from "src/modules/document/dtos/request/create-document.dto";
import { GetAllDocumentQuery, getAllDocumentQuerySchema } from "src/modules/document/dtos/request/get-all-document.dto";
import { UpdateDocumentBody } from "src/modules/document/dtos/request/update-document.dto";
import { CreateDocumentResponseDto } from "src/modules/document/dtos/response/create-document-response.dto";
import { DeleteDocumentResponseDto } from "src/modules/document/dtos/response/delete-document-response.dto";
import { GetAllDocumentResponseDto } from "src/modules/document/dtos/response/get-all-document.dto";
import { UpdateDocumentResponseDto } from "src/modules/document/dtos/response/update-document-response.dto";
import { ApiResponse } from "src/types/api-response";
import { UserJwtPayload } from "src/types/user-jwt-payload";

@Controller("api/document")
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @Get(":storyId")
    @UsePipes(new ZodValidationPipe(getAllDocumentQuerySchema, "query"))
    async getAll(
        @Param("storyId") storyId: number,
        @CurrentUser() user: UserJwtPayload,
        @Query() query: GetAllDocumentQuery,
    ): Promise<ApiResponse<GetAllDocumentResponseDto>> {
        const res = await this.documentService.getAll({ ...query, userId: user.id, storyId });
        return apiResponse("get all document fetched", res);
    }

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
