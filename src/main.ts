import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "src/common/filters/http-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableShutdownHooks();
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
