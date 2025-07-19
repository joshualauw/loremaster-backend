import { ChunkResultItem } from "src/modules/ai/dtos/common/ChunkResultItem";
import { SceneOptions } from "src/modules/ai/dtos/common/SceneOptions";

export interface GenerateSceneDto {
    chunks: ChunkResultItem[];
    options: SceneOptions;
}
