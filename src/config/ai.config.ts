import { registerAs } from "@nestjs/config";

export default registerAs("ai", () => ({
    splitChunkSize: 400,
    splitChunkOverlap: 40,
    vectorSearchThreshold: 0.7,
    fullTextSearchThreshold: 0.1,
    vectorSearchBasechunks: 3,
    vectorSearchMaximumChunks: 20,
    vectorSearchGrowthFactor: 1.5,
    vectorSearchScoreWeight: 0.75,
    fullTextSearchScoreWeight: 0.25,
    rerankingChunkMaximumResult: 6,
}));
