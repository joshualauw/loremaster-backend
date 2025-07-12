import { AiService } from "src/modules/ai/ai.service";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { QueueKey } from "src/common/enums/queue.enum";
import { Document } from "@prisma/client";
import { PrismaService } from "src/core/database/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
        const vectors = await this.aiService.embedChunks(chunks);

        try {
            await this.prisma.$transaction(async (tx) => {
                for (let i = 0; i < chunks.length; i++) {
                    await tx.$executeRaw`
                        INSERT INTO public."DocumentChunk" ("documentId", title, index, content, vector)
                        VALUES (${job.data.documentId}, ${job.data.name}, ${i}, ${chunks[i]}, ${vectors[i]})
                    `;
                }
                await tx.document.update({
                    where: { documentId: job.data.documentId },
                    data: { jobStatus: "DONE" },
                });
            });
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                console.log(err.message);

                await this.prisma.document.update({
                    where: { documentId: job.data.documentId },
                    data: {
                        jobStatus: "FAILED",
                        jobReason: `[${err.code}] ${err.message.trim().replace(/\s+/g, " ")}`,
                    },
                });
            }
        }
    }
}
