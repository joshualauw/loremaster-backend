import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateStoryDto } from "./dtos/create-story.dto";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateStoryResponseDto } from "src/story/dtos/create-story-response.dto";

@Injectable()
export class StoryService {
    constructor(private prisma: PrismaService) {}

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
}
