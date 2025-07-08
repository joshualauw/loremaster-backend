import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateStoryDto } from "./dtos/request/create-story.dto";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateStoryResponseDto } from "src/modules/story/dtos/response/create-story-response.dto";
import { UpdateStoryDto } from "src/modules/story/dtos/request/update-story.dto";
import { UpdateStoryResponseDto } from "src/modules/story/dtos/response/update-story-response.dto";
import { DeleteStoryDto } from "src/modules/story/dtos/request/delete-story.dto";
import { DeleteStoryResponseDto } from "src/modules/story/dtos/response/delete-story-response.dto";
import { FindAllByUserDto } from "src/modules/story/dtos/response/find-all-by-user.dto";
import { mapObject } from "src/core/utils/mapper";

@Injectable()
export class StoryService {
    constructor(private prisma: PrismaService) {}

    async findAllByUser(userId: number): Promise<FindAllByUserDto[]> {
        const stories = await this.prisma.story.findMany({
            where: { userId },
        });

        return stories.map((s) => mapObject(FindAllByUserDto, s));
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

        return mapObject(CreateStoryResponseDto, newStory);
    }

    async canChangeStory(ownerId: number, userId: number) {
        await this.prisma.user.findFirstOrThrow({
            where: { userId },
        });

        if (ownerId != userId) {
            throw new ForbiddenException("User doesn't have permission to access story");
        }
    }

    async update(payload: UpdateStoryDto): Promise<UpdateStoryResponseDto> {
        const { storyId, userId, title, description } = payload;

        const story = await this.prisma.story.findFirstOrThrow({
            where: { storyId },
        });

        await this.canChangeStory(story.userId, userId);

        const updatedStory = await this.prisma.story.update({
            where: { storyId },
            data: {
                title,
                description,
            },
        });

        return mapObject(UpdateStoryResponseDto, updatedStory);
    }

    async delete(payload: DeleteStoryDto): Promise<DeleteStoryResponseDto> {
        const { storyId, userId } = payload;

        const story = await this.prisma.story.findFirstOrThrow({
            where: { storyId },
        });

        await this.canChangeStory(story.userId, userId);

        await this.prisma.story.delete({
            where: { storyId },
        });

        return mapObject(DeleteStoryResponseDto, story);
    }
}
