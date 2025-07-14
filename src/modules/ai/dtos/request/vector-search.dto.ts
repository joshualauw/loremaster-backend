export interface VectorSearchDto {
    vectorString: string;
    documentIds: number[];
    distanceThreshold: number;
    limit: number;
}
