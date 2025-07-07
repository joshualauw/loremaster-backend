import { Story } from "@prisma/client";

export type StoryItemDto = Omit<Story, "updatedAt">;
