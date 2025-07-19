import { SceneMaterials } from "src/modules/ai/dtos/common/SceneMaterials";
import { SceneOptions } from "src/modules/ai/dtos/common/SceneOptions";

export interface GeneratingTaskDto {
    sceneId: number;
    options: SceneOptions;
    materials: SceneMaterials;
}
