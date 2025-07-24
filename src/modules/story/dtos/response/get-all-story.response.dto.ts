import { Story } from "@prisma/client";

export interface GetAllStoryResponseDto extends Array<Pick<Story, "storyId" | "title" | "logoUrl" | "updatedAt">> {}
