import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import baseConfig from "src/config/base.config";
import { UserModule } from "src/modules/user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [baseConfig],
        }),
        UserModule,
    ],
})
export class AppModule {}
