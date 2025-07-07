import { Expose } from "class-transformer";

export class LoginResponseDto {
    @Expose()
    user: {
        userId: number;
        email: string;
        username: string;
    };

    @Expose()
    token: string;
}
