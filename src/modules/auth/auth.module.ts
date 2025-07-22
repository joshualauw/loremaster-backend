import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "src/modules/auth/auth.service";
import jwtConfig from "src/config/jwt.config";
import { JwtStrategy } from "src/modules/auth/strategies/jwt.strategy";
import { AuthStrategy } from "src/modules/auth/enum/AuthStrategy";
import { GoogleAuthStrategy } from "src/modules/auth/strategies/google-auth.strategy";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: AuthStrategy.JWT }),
        JwtModule.registerAsync({
            imports: [ConfigModule.forFeature(jwtConfig)],
            useFactory: (config: ConfigType<typeof jwtConfig>) => ({
                secret: config.secret,
                signOptions: {
                    expiresIn: config.expiresIn,
                },
            }),
            inject: [jwtConfig.KEY],
        }),
    ],
    providers: [AuthService, JwtStrategy, GoogleAuthStrategy],
    exports: [JwtModule, AuthService],
})
export class AuthModule {}
