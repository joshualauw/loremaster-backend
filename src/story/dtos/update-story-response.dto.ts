import { Story } from "@prisma/client";

export type UpdateStoryResponseDto = Pick<Story, "storyId" | "userId" | "title" | "description">;
