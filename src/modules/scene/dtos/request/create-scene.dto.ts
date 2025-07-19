import { Type } from "class-transformer";
import { IsNotEmpty, IsArray, IsString, ValidateNested } from "class-validator";

class SceneOptionsBody {
    @IsString()
    tone: string;

    @IsString()
    atmosphere: string;

    @IsString()
    conflict: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

class SceneMaterialsBody {
    @IsArray()
    documentIds: number[];

    @IsString()
    intent: string;
}
export class CreateSceneBody {
    @ValidateNested()
    @Type(() => SceneMaterialsBody)
    materials: SceneMaterialsBody;

    @ValidateNested()
    @Type(() => SceneOptionsBody)
    options: SceneOptionsBody;
}

export type CreateSceneDto = CreateSceneBody & {
    storyId: number;
    userId: number;
};
