import z from "zod";

export const createStoryBodyScema = z.object({
    title: z.string(),
    description: z.string(),
});

export type CreateStoryBody = z.infer<typeof createStoryBodyScema>;

export type CreateStoryDto = CreateStoryBody & {
    userId: number;
};
