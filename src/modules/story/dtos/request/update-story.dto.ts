import z from "zod";

export const updateStoryBodyScema = z.object({
    title: z.string(),
    description: z.string(),
});

export type UpdateStoryBody = z.infer<typeof updateStoryBodyScema>;

export type UpdateStoryDto = UpdateStoryBody & {
    storyId: number;
    userId: number;
};
