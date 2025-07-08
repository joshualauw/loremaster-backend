import { Expose, Type } from "class-transformer";

class UserDto {
    @Expose()
    userId: number;

    @Expose()
    email: string;

    @Expose()
    username: string;
}

export class LoginResponseDto {
    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    @Expose()
    token: string;
}
