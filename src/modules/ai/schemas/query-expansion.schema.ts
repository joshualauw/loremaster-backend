import z from "zod";

export const queryExpansionSchema = z.object({
    vectorFriendlyQuery: z.string(),
    fulltextFriendlyQuery: z.string(),
});

export type QueryExpansion = z.infer<typeof queryExpansionSchema>;
