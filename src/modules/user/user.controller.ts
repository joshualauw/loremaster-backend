import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { apiResponse } from "src/core/utils/apiResponse";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { LoginResponseDto } from "src/modules/user/dto/login-response.dto";
import { LoginDto } from "src/modules/user/dto/login.dto";
import { RegisterResponseDto } from "src/modules/user/dto/register-response.dto";
import { RegisterDto } from "src/modules/user/dto/register.dto";
import { UserService } from "src/modules/user/user.service";
import { ApiResponse } from "src/types/ApiResponse";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    @Get("me")
    me() {
        return "hi, it's me";
    }

    @Post("register")
    @Public()
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterDto): Promise<ApiResponse<RegisterResponseDto>> {
        const res = await this.userService.register(dto);
        return apiResponse("register success", res);
    }

    @Post("login")
    @Public()
    async login(@Body() dto: LoginDto): Promise<ApiResponse<LoginResponseDto>> {
        const res = await this.userService.login(dto);
        return apiResponse("login success", res);
    }
}
