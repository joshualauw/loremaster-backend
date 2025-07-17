import { Story } from "@prisma/client";

export interface UpdateStoryResponseDto extends Omit<Story, "logoUrl" | "createdAt"> {}
