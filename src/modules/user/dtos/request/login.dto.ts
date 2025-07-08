import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginBody {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export type LoginDto = LoginBody;
