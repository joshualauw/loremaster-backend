import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { QueueKey } from "src/common/enums/queue.enum";

@Processor(QueueKey.PREPROCESSING)
export class PreprocessingConsumer extends WorkerHost {
    async process(job: Job) {
        console.log(`job processed with id of ${job.id}`);
        return job;
    }
}
