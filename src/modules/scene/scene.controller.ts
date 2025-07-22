import { Body, Controller, Param, Post } from "@nestjs/common";
import { apiResponse } from "src/core/utils/apiResponse";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { CreateSceneBody } from "src/modules/scene/dtos/request/create-scene.dto";
import { CreateSceneResponseDto } from "src/modules/scene/dtos/response/create-scene-response.dto";
import { SceneService } from "src/modules/scene/scene.service";
import { ApiResponse } from "src/types/ApiResponse";
import { UserJwtPayload } from "src/types/UserJwtPayload";

@Controller("scene")
export class SceneController {
    constructor(private sceneService: SceneService) {}

    @Post(":storyId")
    async create(
        @Param("storyId") storyId: number,
        @CurrentUser() user: UserJwtPayload,
        @Body() body: CreateSceneBody,
    ): Promise<ApiResponse<CreateSceneResponseDto>> {
        const res = await this.sceneService.create({ storyId, userId: user.id, ...body });
        return apiResponse("scene created", res);
    }
}
