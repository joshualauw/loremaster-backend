import { registerAs } from "@nestjs/config";

export default registerAs("ai", () => ({
    splitChunkSize: 400,
    splitChunkOverlap: 40,
    vectorSearchThreshold: 0.7,
    fullTextSearchThreshold: 0.1,
    vectorSearchBasechunks: 5,
    vectorSearchMaximumChunks: 20,
    vectorSearchGrowthFactor: 1.5,
    vectorSearchScoreWeight: 0.7,
    fullTextSearchScoreWeight: 0.3,
    rerankingChunkMaximumResult: 6,
}));
