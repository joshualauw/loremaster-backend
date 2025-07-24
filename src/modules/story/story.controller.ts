import { Controller, Post, Body, HttpCode, HttpStatus, Put, Param, Delete, Get } from "@nestjs/common";
import { StoryService } from "./story.service";
import { CreateStoryBody } from "./dtos/request/create-story.dto";
import { apiResponse } from "src/core/utils/apiResponse";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { UserJwtPayload } from "src/types/UserJwtPayload";
import { UpdateStoryBody } from "src/modules/story/dtos/request/update-story.dto";
import { ApiResponse } from "src/types/ApiResponse";
import { CreateStoryResponseDto } from "src/modules/story/dtos/response/create-story-response.dto";
import { UpdateStoryResponseDto } from "src/modules/story/dtos/response/update-story-response.dto";
import { DeleteStoryResponseDto } from "src/modules/story/dtos/response/delete-story-response.dto";
import { GetAllStoryResponseDto } from "src/modules/story/dtos/response/get-all-story.response.dto";

@Controller("api/story")
export class StoryController {
    constructor(private readonly storyService: StoryService) {}

    @Get()
    async getAllStory(@CurrentUser() user: UserJwtPayload): Promise<ApiResponse<GetAllStoryResponseDto>> {
        const res = await this.storyService.getAllStory({ userId: user.id });
        return apiResponse("get all story fetched", res);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUser() user: UserJwtPayload,
        @Body() body: CreateStoryBody,
    ): Promise<ApiResponse<CreateStoryResponseDto>> {
        const res = await this.storyService.create({ ...body, userId: user.id });
        return apiResponse("story created", res);
    }

    @Put(":id")
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
