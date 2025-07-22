import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import { apiResponse } from "src/core/utils/apiResponse";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { LoginResponseDto } from "src/modules/user/dtos/response/login-response.dto";
import { LoginBody } from "src/modules/user/dtos/request/login.dto";
import { RegisterResponseDto } from "src/modules/user/dtos/response/register-response.dto";
import { RegisterBody } from "src/modules/user/dtos/request/register.dto";
import { UserService } from "src/modules/user/user.service";
import { ApiResponse } from "src/types/ApiResponse";
import { GoogleAuthGuard } from "src/modules/auth/guards/google-auth.guard";
import { GoogleUserPayload } from "src/types/GoogleUserPayload";
import { Request, Response } from "express";
import { ConfigType } from "@nestjs/config";
import commonConfig from "src/config/common.config";

@Controller("api/user")
export class UserController {
    constructor(
        private userService: UserService,
        @Inject(commonConfig.KEY) private commonCfg: ConfigType<typeof commonConfig>,
    ) {}

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

    @Get("login-google")
    @Public()
    @UseGuards(GoogleAuthGuard)
    async googleLogin() {}

    @Get("login-google/callback")
    @Public()
    @UseGuards(GoogleAuthGuard)
    async googleLoginCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
        const payload = req.user as GoogleUserPayload;
        console.log(payload);
        const result = await this.userService.loginWithGoogle(payload);

        return res.redirect(this.commonCfg.frontendUrl + `/api/auth/google-login?token=${result.token}`);
    }
}
