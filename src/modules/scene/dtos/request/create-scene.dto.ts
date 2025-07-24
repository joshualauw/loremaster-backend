import z from "zod";

export const createSceneBodySchema = z.object({
    materials: z.object({
        documentIds: z.array(z.number()),
        intent: z.string(),
    }),
    options: z.object({
        tone: z.string(),
        atmosphere: z.string(),
        conflict: z.string(),
        description: z.string(),
    }),
});

export type CreateSceneBody = z.infer<typeof createSceneBodySchema>;

export type CreateSceneDto = CreateSceneBody & {
    storyId: number;
    userId: number;
};
