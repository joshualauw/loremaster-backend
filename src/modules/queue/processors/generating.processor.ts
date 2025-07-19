import { Processor, WorkerHost } from "@nestjs/bullmq";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Job } from "bullmq";
import { QueueKey } from "src/modules/queue/enums/queue.enum";
import { PrismaService } from "src/core/database/prisma.service";
import { GeneratingTaskDto } from "src/modules/queue/dtos/request/generating-task.dto";
import { RetrievalService } from "src/modules/ai/services/retrieval.service";
import { RerankingService } from "src/modules/ai/services/reranking.service";
import { OpenAIService } from "src/core/llm/openai.service";

@Processor(QueueKey.GENERATING)
export class GeneratingProcessor extends WorkerHost {
    constructor(
        private retrieval: RetrievalService,
        private prisma: PrismaService,
        private reranking: RerankingService,
        private openai: OpenAIService,
    ) {
        super();
    }

    async process(job: Job<GeneratingTaskDto>) {
        try {
            const { sceneId, tone, description, atmosphere, conflict, documentIds } = job.data;

            const keys = [tone, description, atmosphere, conflict];
            const rawQuery = keys.map((key) => `${key}: ${job.data[key]}`).join(", ");

            const chunks = await this.retrieval.searchChunks({
                documentIds,
                rawQuery,
            });

            await this.prisma.scene.update({
                where: { sceneId },
                data: { jobStatus: "DONE" },
            });
        } catch (err) {
            let reason = err.message;
            console.log(err.message);

            if (err instanceof PrismaClientKnownRequestError) {
                reason = `[${err.code}] ${err.message.trim().replace(/\s+/g, " ")}`;
            }

            await this.prisma.scene.update({
                where: { sceneId: job.data.sceneId },
                data: {
                    jobStatus: "FAILED",
                    jobReason: reason,
                },
            });
        }
    }
}
