import { Story } from "@prisma/client";

export interface CreateStoryResponseDto extends Omit<Story, "updatedAt" | "logoUrl"> {}
