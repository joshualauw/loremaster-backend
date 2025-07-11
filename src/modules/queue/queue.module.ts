import { PrismaService } from "src/core/database/prisma.service";
import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { PreprocessingConsumer } from "src/modules/queue/queue.processor";
import { AiModule } from "src/modules/ai/ai.module";
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
    providers: [PrismaService, PreprocessingConsumer],
    exports: [BullModule],
})
export class QueueModule {}
