import { Expose, Type } from "class-transformer";

class UserDto {
    @Expose()
    userId: number;

    @Expose()
    email: string;

    @Expose()
    username: string;

    @Expose()
    createdAt: Date;
}

export class RegisterResponseDto {
    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    @Expose()
    token: string;
}
