import { AiService } from "src/modules/ai/ai.service";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { QueueKey } from "src/modules/queue/enums/queue.enum";
import { PrismaService } from "src/core/database/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ChunkingTaskDto } from "src/modules/queue/dtos/request/chunking-task.dto";

@Processor(QueueKey.CHUNKING)
export class ChunkingProcessor extends WorkerHost {
    constructor(
        private aiService: AiService,
        private prisma: PrismaService,
    ) {
        super();
    }

    async process(job: Job<ChunkingTaskDto>) {
        try {
            const cleaned = this.aiService.cleanText(job.data.content);
            const chunks = await this.aiService.createChunks(cleaned);
            const vectors = await this.aiService.embedChunks(chunks);

            await this.aiService.storeChunks({
                documentId: job.data.documentId,
                chunks,
                vectors,
            });

            await this.prisma.document.update({
                where: { documentId: job.data.documentId },
                data: { jobStatus: "DONE" },
            });
        } catch (err) {
            let reason = err.message;
            console.log(err.message);

            if (err instanceof PrismaClientKnownRequestError) {
                reason = `[${err.code}] ${err.message.trim().replace(/\s+/g, " ")}`;
            }

            await this.prisma.document.update({
                where: { documentId: job.data.documentId },
                data: {
                    jobStatus: "FAILED",
                    jobReason: reason,
                },
            });
        }
    }
}
