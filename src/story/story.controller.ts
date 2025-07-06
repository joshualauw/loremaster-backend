import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { StoryService } from "./story.service";
import { CreateStoryBody, CreateStoryDto } from "./dtos/create-story.dto";
import { apiResponse } from "src/core/utils/apiResponse";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { UserJwtPayload } from "src/types/UserJwtPayload";

@Controller("story")
export class StoryController {
    constructor(private readonly storyService: StoryService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@CurrentUser() user: UserJwtPayload, @Body() body: CreateStoryBody) {
        const res = await this.storyService.create({ ...body, userId: user.id });
        return apiResponse("story created", res);
    }
}
