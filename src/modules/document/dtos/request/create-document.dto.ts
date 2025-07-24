import z from "zod";

export const createDocumentBodySchema = z.object({
    name: z.string(),
    fields: z.array(
        z.object({
            label: z.string(),
            content: z.string(),
        }),
    ),
    categoryId: z.number(),
});

export type CreateDocumentBody = z.infer<typeof createDocumentBodySchema>;

export type CreateDocumentDto = CreateDocumentBody & {
    storyId: number;
    userId: number;
};
