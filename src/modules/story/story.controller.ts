import { Controller, Post, Body, HttpCode, HttpStatus, Put, Param, Delete, Get, UsePipes } from "@nestjs/common";
import { StoryService } from "./story.service";
import { CreateStoryBody, createStoryBodyScema } from "./dtos/request/create-story.dto";
import { apiResponse } from "src/core/utils/apiResponse";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { UserJwtPayload } from "src/types/user-jwt-payload";
import { UpdateStoryBody, updateStoryBodyScema } from "src/modules/story/dtos/request/update-story.dto";
import { ApiResponse } from "src/types/api-response";
import { CreateStoryResponseDto } from "src/modules/story/dtos/response/create-story-response.dto";
import { UpdateStoryResponseDto } from "src/modules/story/dtos/response/update-story-response.dto";
import { DeleteStoryResponseDto } from "src/modules/story/dtos/response/delete-story-response.dto";
import { GetAllStoryResponseDto } from "src/modules/story/dtos/response/get-all-story.response.dto";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";

@Controller("api/story")
export class StoryController {
    constructor(private readonly storyService: StoryService) {}

    @Get()
    async getAll(@CurrentUser() user: UserJwtPayload): Promise<ApiResponse<GetAllStoryResponseDto>> {
        const res = await this.storyService.getAll({ userId: user.id });
        return apiResponse("get all story fetched", res);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(createStoryBodyScema))
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUser() user: UserJwtPayload,
        @Body() body: CreateStoryBody,
    ): Promise<ApiResponse<CreateStoryResponseDto>> {
        const res = await this.storyService.create({ ...body, userId: user.id });
        return apiResponse("story created", res);
    }

    @Put(":id")
    @UsePipes(new ZodValidationPipe(updateStoryBodyScema))
    async update(
        @Param("id") id: number,
        @CurrentUser() user: UserJwtPayload,
        @Body() body: UpdateStoryBody,
    ): Promise<ApiResponse<UpdateStoryResponseDto>> {
        const res = await this.storyService.update({ ...body, storyId: id, userId: user.id });
        return apiResponse("story updated", res);
    }

    @Delete(":id")
    async delete(
        @Param("id") id: number,
        @CurrentUser() user: UserJwtPayload,
    ): Promise<ApiResponse<DeleteStoryResponseDto>> {
        const res = await this.storyService.delete({ storyId: id, userId: user.id });
        return apiResponse("story deleted", res);
    }
}
