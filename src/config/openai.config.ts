import { registerAs } from "@nestjs/config";
import { EmbeddingModel } from "openai/resources/embeddings";

export default registerAs("openai", () => ({
    apiKey: process.env.OPENAI_API_KEY || "",
    embeddingModel: "text-embedding-3-small" as EmbeddingModel,
}));
