import { registerAs } from "@nestjs/config";

export default registerAs("ai", () => ({
    splitChunkSize: 400,
    splitChunkOverlap: 40,
    vectorSearchDistanceThreshold: 0.7,
    vectorSearchBasechunks: 3,
    vectorSearchMaximumChunks: 20,
    vectorSearchGrowthFactor: 1.5,
}));
