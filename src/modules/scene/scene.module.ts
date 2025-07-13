import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { QueueKey } from "src/modules/queue/enums/queue.enum";
import { PrismaService } from "src/core/database/prisma.service";
import { SceneController } from "src/modules/scene/scene.controller";
import { SceneService } from "src/modules/scene/scene.service";

@Module({
    imports: [BullModule.registerQueue({ name: QueueKey.GENERATING })],
    controllers: [SceneController],
    providers: [PrismaService, SceneService],
})
export class SceneModule {}
