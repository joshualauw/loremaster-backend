export interface FullTextSearchDto {
    query: string;
    scoreThreshold: number;
    documentIds: number[];
    limit: number;
}
