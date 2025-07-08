import { registerAs } from "@nestjs/config";

export default registerAs("rules", () => ({
    maxCharacterPerDocument: parseInt(process.env.MAX_CHARACTER_PER_DOCUMENT || "5000"),
}));
