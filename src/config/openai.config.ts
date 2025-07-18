import { registerAs } from "@nestjs/config";
import { EmbeddingModel } from "openai/resources/embeddings";
import { ResponsesModel } from "openai/resources/shared";

export default registerAs("openai", () => ({
    apiKey: process.env.OPENAI_API_KEY || "",
    embeddingModel: "text-embedding-3-small" as EmbeddingModel,
    reasoningModel: "o4-mini" as ResponsesModel,
    structureResponseModel: "gpt-4o-mini" as ResponsesModel,
}));
