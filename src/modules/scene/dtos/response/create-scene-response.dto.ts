import { Scene } from "@prisma/client";

export interface CreateSceneResponseDto extends Pick<Scene, "sceneId" | "createdAt" | "jobStatus"> {}
