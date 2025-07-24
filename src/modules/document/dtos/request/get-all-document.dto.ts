import z from "zod";

export const getAllDocumentQuerySchema = z.object({
    sortBy: z.string().optional().default("latest"),
    categoryId: z
        .string()
        .optional()
        .default("0")
        .transform((v) => parseInt(v)),
    page: z
        .string()
        .optional()
        .default("1")
        .transform((v) => parseInt(v)),
});

export type GetAllDocumentQuery = z.infer<typeof getAllDocumentQuerySchema>;

export interface GetAllDocumentDto extends GetAllDocumentQuery {
    userId: number;
    storyId: number;
}
