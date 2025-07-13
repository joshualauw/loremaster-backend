import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { QueueKey } from "src/modules/queue/enums/queue.enum";
import { PrismaService } from "src/core/database/prisma.service";
import { DocumentController } from "src/modules/document/document.controller";
import { DocumentService } from "src/modules/document/document.service";

@Module({
    imports: [BullModule.registerQueue({ name: QueueKey.CHUNKING })],
    controllers: [DocumentController],
    providers: [PrismaService, DocumentService],
})
export class DocumentModule {}
