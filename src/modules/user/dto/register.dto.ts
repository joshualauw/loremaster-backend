import { IsEmail, IsString, MinLength } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(6)
    @Match("password", { message: "Confirm password does not match" })
    confirmPassword: string;

    @IsString()
    @MinLength(6)
    username: string;
}
