import { registerAs } from "@nestjs/config";

export default registerAs("common", () => ({
    port: process.env.PORT || 3001,
    baseUrl: process.env.BASE_URL || "http://localhost:3001",
}));
