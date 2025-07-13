import { PrismaService } from "src/core/database/prisma.service";
import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { ChunkingProcessor } from "src/modules/queue/processors/chunking.processor";
import { AiModule } from "src/modules/ai/ai.module";
import { GeneratingProcessor } from "src/modules/queue/processors/generating.processor";
import bullmqConfig from "src/config/bullmq.config";

@Module({
    imports: [
        AiModule,
        BullModule.forRootAsync({
            imports: [ConfigModule.forFeature(bullmqConfig)],
            useFactory: (config: ConfigType<typeof bullmqConfig>) => ({
                connection: {
                    host: config.host,
                    port: config.port,
                },
            }),
            inject: [bullmqConfig.KEY],
        }),
    ],
    providers: [PrismaService, ChunkingProcessor, GeneratingProcessor],
    exports: [BullModule],
})
export class QueueModule {}
