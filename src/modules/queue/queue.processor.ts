import { AiService } from "src/modules/ai/ai.service";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { QueueKey } from "src/common/enums/queue.enum";
import { Document } from "@prisma/client";

@Processor(QueueKey.PREPROCESSING)
export class PreprocessingConsumer extends WorkerHost {
    constructor(private aiService: AiService) {
        super();
    }

    async process(job: Job<Document>) {
        const cleaned = this.aiService.cleanText(job.data.content);
        const chunks = await this.aiService.createChunks(cleaned);
        console.log(chunks);
        return job;
    }
}
