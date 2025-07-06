import { Story } from "@prisma/client";

export type CreateStoryResponseDto = Pick<Story, "storyId" | "userId" | "title" | "description" | "createdAt">;
