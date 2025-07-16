export {};

declare global {
    namespace PrismaJson {
        type OriginalDataItem = {
            label: string;
            content: string;
        };

        type OriginalData = OriginalDataItem[];
    }
}
