import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback, Profile } from "passport-google-oauth20";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import googleAuthConfig from "src/config/google-auth.config";
import { GoogleUserPayload } from "src/types/google-user-payload";
import { AuthStrategy } from "src/modules/auth/enum/AuthStrategy";

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, AuthStrategy.GOOGLE) {
    constructor(@Inject(googleAuthConfig.KEY) private googleAuthCfg: ConfigType<typeof googleAuthConfig>) {
        super({
            clientID: googleAuthCfg.clientId,
            clientSecret: googleAuthCfg.clientSecret,
            callbackURL: googleAuthCfg.callbackUrl,
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
            ],
        });
    }

    async validate(_1: string, _2: string, profile: Profile, done: VerifyCallback) {
        const { id, displayName, emails, photos } = profile;

        const googleUser: GoogleUserPayload = {
            id,
            name: displayName,
            email: emails ? emails[0].value : "",
            photoUrl: photos ? photos[0].value : "",
        };

        done(null, googleUser);
    }
}
