import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { apiResponse } from "src/core/utils/apiResponse";
import { RegisterDto } from "src/modules/user/dto/register.dto";
import { UserService } from "src/modules/user/user.service";
import { ApiResponse } from "src/types/common/ApiResponse";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterDto): Promise<ApiResponse<any>> {
        const res = await this.userService.register(dto);
        return apiResponse("register success", res);
    }
}
