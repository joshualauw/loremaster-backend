import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "src/config/jwt.config";
import { UserJwtPayload } from "src/types/user-jwt-payload";
import { AuthStrategy } from "src/modules/auth/enum/AuthStrategy";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategy.JWT) {
    constructor(@Inject(jwtConfig.KEY) config: ConfigType<typeof jwtConfig>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.secret,
        });
    }

    async validate(payload: UserJwtPayload) {
        return payload;
    }
}
