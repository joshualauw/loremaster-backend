import { Module } from "@nestjs/common";
import { StoryService } from "./story.service";
import { StoryController } from "./story.controller";
import { PrismaService } from "src/core/database/prisma.service";

@Module({
    controllers: [StoryController],
    providers: [PrismaService, StoryService],
})
export class StoryModule {}
