import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";

export class RegisterBody {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    @Match("password", { message: "Confirm password does not match" })
    confirmPassword: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    username: string;
}

export type RegisterDto = RegisterBody;
