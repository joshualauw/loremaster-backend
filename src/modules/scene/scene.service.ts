import { InjectQueue } from "@nestjs/bullmq";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { QueueKey } from "src/modules/queue/enums/queue.enum";
import { PrismaService } from "src/core/database/prisma.service";
import { GeneratingTaskDto } from "src/modules/queue/dtos/request/generating-task.dto";
import { CreateSceneDto } from "src/modules/scene/dtos/request/create-scene.dto";
import { CreateSceneResponseDto } from "src/modules/scene/dtos/response/create-scene-response.dto";
import { pick } from "src/core/utils/mapper";

@Injectable()
export class SceneService {
    constructor(
        private prisma: PrismaService,
        @InjectQueue(QueueKey.GENERATING) private queue: Queue,
    ) {}

    async canChangeScene(storyId: number, userId: number) {
        const story = await this.prisma.story.findFirstOrThrow({
            where: { storyId },
        });

        if (story.userId != userId) {
            throw new ForbiddenException("User doesn't have permission to access scene");
        }
    }

    async create(payload: CreateSceneDto): Promise<CreateSceneResponseDto> {
        const { storyId, userId, options, materials } = payload;

        this.canChangeScene(storyId, userId);

        const newScene = await this.prisma.scene.create({
            data: {
                storyId,
                content: "",
                jobStatus: "PENDING",
            },
        });

        await this.queue.add("generating", {
            sceneId: newScene.sceneId,
            options,
            materials,
        } as GeneratingTaskDto);

        return pick(newScene, "sceneId", "jobStatus", "createdAt");
    }
}
