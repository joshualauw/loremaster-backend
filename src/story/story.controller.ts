import { Controller, Post, Body, HttpCode, HttpStatus, Put, Param, Delete, Get } from "@nestjs/common";
import { StoryService } from "./story.service";
import { CreateStoryBody } from "./dtos/create-story.dto";
import { apiResponse } from "src/core/utils/apiResponse";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { UserJwtPayload } from "src/types/UserJwtPayload";
import { UpdateStoryBody } from "src/story/dtos/update-story.dto";

@Controller("story")
export class StoryController {
    constructor(private readonly storyService: StoryService) {}

    @Get()
    async findAllByUser(@CurrentUser() user: UserJwtPayload) {
        const res = await this.storyService.findAllByUser(user.id);
        return apiResponse("story fetched", res);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@CurrentUser() user: UserJwtPayload, @Body() body: CreateStoryBody) {
        const res = await this.storyService.create({ ...body, userId: user.id });
        return apiResponse("story created", res);
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() body: UpdateStoryBody) {
        const res = await this.storyService.update({ ...body, storyId: id });
        return apiResponse("story updated", res);
    }

    @Delete(":id")
    async delete(@Param("id") id: number) {
        const res = await this.storyService.delete({ storyId: id });
        return apiResponse("story deleted", res);
    }
}
