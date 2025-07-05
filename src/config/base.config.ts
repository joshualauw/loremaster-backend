import { registerAs } from "@nestjs/config";

export default registerAs("base", () => ({
    test: process.env.TEST || "test",
}));
