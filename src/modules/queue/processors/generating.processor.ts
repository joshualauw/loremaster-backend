import { Processor, WorkerHost } from "@nestjs/bullmq";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Job } from "bullmq";
import { QueueKey } from "src/modules/queue/enums/queue.enum";
import { PrismaService } from "src/core/database/prisma.service";
import { GeneratingTaskDto } from "src/modules/queue/dtos/request/generating-task.dto";
import { RetrievalService } from "src/modules/ai/services/retrieval.service";
import { GenerationService } from "src/modules/ai/services/generation.service";

@Processor(QueueKey.GENERATING)
export class GeneratingProcessor extends WorkerHost {
    constructor(
        private retrieval: RetrievalService,
        private prisma: PrismaService,
        private generation: GenerationService,
    ) {
        super();
    }

    async process(job: Job<GeneratingTaskDto>): Promise<void> {
        try {
            const { sceneId, materials, options } = job.data;
            const { documentIds, intent } = materials;

            const chunks = await this.retrieval.searchChunks({ documentIds, rawQuery: intent });
            const scene = await this.generation.generateScene({ chunks, options });

            await this.prisma.scene.update({
                where: { sceneId },
                data: { content: scene, jobStatus: "DONE" },
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
