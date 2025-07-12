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
                const values: any[] = [];
                const placeholders: string[] = [];

                for (let i = 0; i < chunks.length; i++) {
                    const offset = i * 5;
                    values.push(job.data.documentId, job.data.name, i, chunks[i], vectors[i]);
                    placeholders.push(
                        `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`,
                    );
                }
                const query = `
                    INSERT INTO public."DocumentChunk" ("documentId", title, index, content, vector)
                    VALUES ${placeholders.join(", ")}
                `;
                await tx.$executeRawUnsafe(query, ...values);

                await tx.document.update({
                    where: { documentId: job.data.documentId },
                    data: { jobStatus: "DONE" },
                });
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
