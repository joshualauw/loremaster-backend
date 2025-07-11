import { AiService } from "src/modules/ai/ai.service";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { QueueKey } from "src/common/enums/queue.enum";
import { Document } from "@prisma/client";
import { PrismaService } from "src/core/database/prisma.service";

@Processor(QueueKey.CHUNKING)
export class ChunkingProcessor extends WorkerHost {
    constructor(
        private aiService: AiService,
        private prisma: PrismaService,
    ) {
        super();
    }

    async process(job: Job<Document>) {
        const cleaned = this.aiService.cleanText(job.data.content);
        const chunks = await this.aiService.createChunks(cleaned);

        return;
    }
}
