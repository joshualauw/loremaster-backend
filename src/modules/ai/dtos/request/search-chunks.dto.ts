export interface SearchChunksDto {
    documentIds: number[];
    vectorQuery: string;
    fulltextQuery: string;
}
