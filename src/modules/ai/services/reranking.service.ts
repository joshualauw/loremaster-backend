import { NormalizeChunksResponseDto } from "src/modules/ai/dtos/response/normalize-chunks-response.dto";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import aiConfig from "src/config/ai.config";
import { ChunkResultItem } from "src/modules/ai/dtos/common/ChunkResultItem";
import { NormalizeChunksDto } from "src/modules/ai/dtos/request/normalize-chunks.dto";

@Injectable()
export class RerankingService {
    constructor(@Inject(aiConfig.KEY) private aiCfg: ConfigType<typeof aiConfig>) {}

    private minMaxNormalize(scores: number[], invert: boolean = false): number[] {
        if (scores.length === 0) return [];

        const min = Math.min(...scores);
        const max = Math.max(...scores);

        if (max === min) {
            return scores.map(() => 1.0);
        }

        return scores.map((score) => {
            const normalized = (score - min) / (max - min);
            return invert ? 1 - normalized : normalized;
        });
    }

    combineSearchResults(
        fullTextResults: NormalizeChunksDto,
        vectorResults: NormalizeChunksDto,
    ): NormalizeChunksResponseDto {
        const fullTextScores = fullTextResults.map((r) => r.score);
        const vectorScores = vectorResults.map((r) => r.score);

        const normalizedFullTextScores = this.minMaxNormalize(fullTextScores);
        const normalizedVectorScores = this.minMaxNormalize(vectorScores, true);

        const fullTextMap = new Map<string, ChunkResultItem>();
        const vectorMap = new Map<string, ChunkResultItem>();

        fullTextResults.forEach((result, index) => {
            fullTextMap.set(result.documentChunkId.toString(), { ...result, score: normalizedFullTextScores[index] });
        });
        vectorResults.forEach((result, index) => {
            vectorMap.set(result.documentChunkId.toString(), { ...result, score: normalizedVectorScores[index] });
        });

        const combinedResults: NormalizeChunksResponseDto = [];
        const chunkIds = new Set([
            ...fullTextResults.map((r) => r.documentChunkId),
            ...vectorResults.map((r) => r.documentChunkId),
        ]);

        for (const chunkId of chunkIds) {
            const fullTextData = fullTextMap.get(chunkId.toString());
            const vectorData = vectorMap.get(chunkId.toString());

            const content = fullTextData?.content ?? vectorData?.content ?? "";
            const index = fullTextData?.index ?? vectorData?.index ?? 0;
            const combinedScore = this.calculateWeightedSum(fullTextData?.score, vectorData?.score);

            combinedResults.push({ documentChunkId: chunkId, content, index, score: combinedScore });
        }

        const sorted = combinedResults.sort((a, b) => b.score - a.score);

        return sorted.slice(0, this.aiCfg.rerankingChunkMaximumResult);
    }

    private calculateWeightedSum(fullTextScore?: number, vectorScore?: number): number {
        const ftScore = fullTextScore ?? 0;
        const vScore = vectorScore ?? 0;
        //if only one score exist
        if (!fullTextScore) return vScore;
        if (!vectorScore) return ftScore;
        //if use both score
        return ftScore * this.aiCfg.fullTextSearchScoreWeight + vScore * this.aiCfg.vectorSearchScoreWeight;
    }
}
