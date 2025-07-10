import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule, ConfigType } from "@nestjs/config";
import bullmqConfig from "src/config/bullmq.config";
import { PreprocessingConsumer } from "src/modules/queue/queue.processor";

@Module({
    imports: [
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
    providers: [PreprocessingConsumer],
    exports: [BullModule],
})
export class QueueModule {}
