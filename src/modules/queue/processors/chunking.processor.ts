import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { QueueKey } from "src/modules/queue/enums/queue.enum";
import { PrismaService } from "src/core/database/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ChunkingTaskDto } from "src/modules/queue/dtos/request/chunking-task.dto";
import { PreprocessingService } from "src/modules/ai/services/preprocessing.service";

@Processor(QueueKey.CHUNKING)
export class ChunkingProcessor extends WorkerHost {
    constructor(
        private preprocessing: PreprocessingService,
        private prisma: PrismaService,
    ) {
        super();
    }

    async process(job: Job<ChunkingTaskDto>): Promise<void> {
        try {
            const document = await this.prisma.document.findFirstOrThrow({
                where: { documentId: job.data.documentId },
            });

            const cleaned = this.preprocessing.cleanText(document.originalData);
            const chunks = await this.preprocessing.createChunks(cleaned);

            await this.preprocessing.storeChunks({
                documentId: job.data.documentId,
                values: chunks.values,
                vectors: chunks.vectors,
            });

            await this.prisma.document.update({
                where: { documentId: job.data.documentId },
                data: { jobStatus: "DONE" },
            });
        } catch (err) {
            let reason = err.message;
            console.log(err.message);

            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code == "P2025") {
                    reason = `[${err.code}] Document not found`;
                } else {
                    reason = `[${err.code}] ${err.message.trim().replace(/\s+/g, " ")}`;
                }
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
