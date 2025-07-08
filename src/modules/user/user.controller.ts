import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { apiResponse } from "src/core/utils/apiResponse";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { LoginResponseDto } from "src/modules/user/dtos/response/login-response.dto";
import { LoginBody } from "src/modules/user/dtos/request/login.dto";
import { RegisterResponseDto } from "src/modules/user/dtos/response/register-response.dto";
import { RegisterBody } from "src/modules/user/dtos/request/register.dto";
import { UserService } from "src/modules/user/user.service";
import { ApiResponse } from "src/types/ApiResponse";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    @Post("register")
    @Public()
    async register(@Body() body: RegisterBody): Promise<ApiResponse<RegisterResponseDto>> {
        const res = await this.userService.register(body);
        return apiResponse("register success", res);
    }

    @Post("login")
    @Public()
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginBody): Promise<ApiResponse<LoginResponseDto>> {
        const res = await this.userService.login(body);
        return apiResponse("login success", res);
    }
}
