import { Expose } from "class-transformer";

export class RegisterResponseDto {
    @Expose()
    user: {
        userId: number;
        email: string;
        username: string;
        createdAt: Date;
    };

    @Expose()
    token: string;
}
