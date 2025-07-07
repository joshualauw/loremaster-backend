import { registerAs } from "@nestjs/config";

export default registerAs("rules", () => ({
    maxStoryPerUser: 3,
    maxDocumentsPerUser: 25,
    maxCharacterPerDocument: 5000,
}));
