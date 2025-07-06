import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateStoryDto } from "./dtos/create-story.dto";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateStoryResponseDto } from "src/story/dtos/create-story-response.dto";
import { UpdateStoryDto } from "src/story/dtos/update-story.dto";
import { UpdateStoryResponseDto } from "src/story/dtos/update-story-response.dto";
import { DeleteStoryDto } from "src/story/dtos/delete-story.dto";
import { DeleteStoryResponseDto } from "src/story/dtos/delete-story-response.dto";
import { StoryItemDto } from "src/story/dtos/story-item.dto";
import { omit } from "src/core/utils/common";

@Injectable()
export class StoryService {
    constructor(private prisma: PrismaService) {}

    async findAllByUser(userId: number): Promise<StoryItemDto[]> {
        const stories = await this.prisma.story.findMany({
            where: { userId },
        });

        return stories.map((s) => omit(s, "updatedAt"));
    }

    async create(payload: CreateStoryDto): Promise<CreateStoryResponseDto> {
        const { title, description, userId } = payload;

        const storyCount = await this.prisma.story.count({
            where: { userId },
        });

        if (storyCount >= 3) {
            throw new ForbiddenException("Maximum story created for free plan");
        }

        const newStory = await this.prisma.story.create({
            data: {
                userId,
                title,
                description,
            },
        });

        return {
            storyId: newStory.storyId,
            userId: newStory.userId,
            title: newStory.title,
            description: newStory.description,
            createdAt: newStory.createdAt,
        };
    }

    async update(payload: UpdateStoryDto): Promise<UpdateStoryResponseDto> {
        const { storyId, title, description } = payload;

        const story = await this.prisma.story.findFirst({
            where: { storyId },
        });

        if (!story) {
            throw new NotFoundException("Story not found");
        }

        const updatedStory = await this.prisma.story.update({
            where: { storyId },
            data: {
                title,
                description,
            },
        });

        return {
            storyId: updatedStory.storyId,
            userId: updatedStory.userId,
            title: updatedStory.title,
            description: updatedStory.description,
        };
    }

    async delete(payload: DeleteStoryDto): Promise<DeleteStoryResponseDto> {
        const { storyId } = payload;

        const story = await this.prisma.story.findFirst({
            where: { storyId },
        });

        if (!story) {
            throw new NotFoundException("Story not found");
        }

        await this.prisma.story.delete({
            where: { storyId },
        });

        return {
            storyId: story.storyId,
        };
    }
}
