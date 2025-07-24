import z from "zod";

export const updateDocumentBodySchema = z.object({
    name: z.string(),
    fields: z.array(
        z.object({
            label: z.string(),
            content: z.string(),
        }),
    ),
    categoryId: z.number(),
});

export type UpdateDocumentBody = z.infer<typeof updateDocumentBodySchema>;

export type UpdateDocumentDto = UpdateDocumentBody & {
    documentId: number;
    userId: number;
};
