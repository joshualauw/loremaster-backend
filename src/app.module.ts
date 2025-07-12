import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "src/modules/auth/auth.module";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.guard";
import { UserModule } from "src/modules/user/user.module";
import { StoryModule } from "src/modules/story/story.module";
import { DocumentModule } from "src/modules/document/document.module";
import { QueueModule } from "src/modules/queue/queue.module";
import jwtConfig from "src/config/jwt.config";
import commonConfig from "src/config/common.config";
import bullmqConfig from "src/config/bullmq.config";
import openaiConfig from "src/config/openai.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [jwtConfig, commonConfig, bullmqConfig, openaiConfig],
        }),
        QueueModule,
        UserModule,
        AuthModule,
        StoryModule,
        DocumentModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
