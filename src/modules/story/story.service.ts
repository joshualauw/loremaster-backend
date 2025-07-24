import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateStoryDto } from "./dtos/request/create-story.dto";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateStoryResponseDto } from "src/modules/story/dtos/response/create-story-response.dto";
import { UpdateStoryDto } from "src/modules/story/dtos/request/update-story.dto";
import { UpdateStoryResponseDto } from "src/modules/story/dtos/response/update-story-response.dto";
import { DeleteStoryDto } from "src/modules/story/dtos/request/delete-story.dto";
import { DeleteStoryResponseDto } from "src/modules/story/dtos/response/delete-story-response.dto";
import { omit, pick } from "src/core/utils/mapper";
import { GetAllStoryDto } from "src/modules/story/dtos/request/get-all-story.dto";
import { GetAllStoryResponseDto } from "src/modules/story/dtos/response/get-all-story.response.dto";

@Injectable()
export class StoryService {
    constructor(private prisma: PrismaService) {}

    async canChangeStory(storyId: number, userId: number) {
        const story = await this.prisma.story.findFirstOrThrow({
            where: { storyId },
        });

        if (story.userId != userId) {
            throw new ForbiddenException("User doesn't have permission to access story");
        }
    }

    async getAllStory(payload: GetAllStoryDto): Promise<GetAllStoryResponseDto> {
        const { userId } = payload;

        const stories = await this.prisma.story.findMany({
            where: { userId },
        });

        return stories.map((s) => pick(s, "storyId", "title", "logoUrl", "updatedAt"));
    }

    async create(payload: CreateStoryDto): Promise<CreateStoryResponseDto> {
        const { title, description, userId } = payload;

        const newStory = await this.prisma.story.create({
            data: {
                userId,
                title,
                description,
            },
        });

        return omit(newStory, "updatedAt", "logoUrl");
    }

    async update(payload: UpdateStoryDto): Promise<UpdateStoryResponseDto> {
        const { storyId, userId, title, description } = payload;

        await this.canChangeStory(storyId, userId);

        const updatedStory = await this.prisma.story.update({
            where: { storyId },
            data: {
                title,
                description,
            },
        });

        return omit(updatedStory, "createdAt", "logoUrl");
    }

    async delete(payload: DeleteStoryDto): Promise<DeleteStoryResponseDto> {
        const { storyId, userId } = payload;

        await this.canChangeStory(storyId, userId);

        const deletedStory = await this.prisma.story.delete({
            where: { storyId },
        });

        return pick(deletedStory, "storyId");
    }
}
