import { Body, Controller, Param, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";
import { apiResponse } from "src/core/utils/apiResponse";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { CreateSceneBody, createSceneBodySchema } from "src/modules/scene/dtos/request/create-scene.dto";
import { CreateSceneResponseDto } from "src/modules/scene/dtos/response/create-scene-response.dto";
import { SceneService } from "src/modules/scene/scene.service";
import { ApiResponse } from "src/types/api-response";
import { UserJwtPayload } from "src/types/user-jwt-payload";

@Controller("api/scene")
export class SceneController {
    constructor(private sceneService: SceneService) {}

    @Post(":storyId")
    @UsePipes(new ZodValidationPipe(createSceneBodySchema))
    async create(
        @Param("storyId") storyId: number,
        @CurrentUser() user: UserJwtPayload,
        @Body() body: CreateSceneBody,
    ): Promise<ApiResponse<CreateSceneResponseDto>> {
        const res = await this.sceneService.create({ storyId, userId: user.id, ...body });
        return apiResponse("scene created", res);
    }
}
