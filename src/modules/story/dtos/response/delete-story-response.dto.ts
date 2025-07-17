import { Story } from "@prisma/client";

export interface DeleteStoryResponseDto extends Pick<Story, "storyId"> {}
