import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "src/modules/auth/auth.module";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.guard";
import { UserModule } from "src/modules/user/user.module";
import { StoryModule } from "src/modules/story/story.module";
import jwtConfig from "src/config/jwt.config";
import rulesConfig from "src/config/rules.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [rulesConfig, jwtConfig],
        }),
        UserModule,
        AuthModule,
        StoryModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
