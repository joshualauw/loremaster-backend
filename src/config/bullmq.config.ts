import { registerAs } from "@nestjs/config";

export default registerAs("bullmq", () => ({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
}));
