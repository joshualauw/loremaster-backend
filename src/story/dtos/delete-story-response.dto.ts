import { Story } from "@prisma/client";

export type DeleteStoryResponseDto = Pick<Story, "storyId">;
