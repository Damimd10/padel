import "reflect-metadata";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { AppModule } from "./app.module.js";
import { GlobalExceptionFilter } from "./common/filters/global-exception/global-exception.filter.js";

export async function createApp() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(app.get(GlobalExceptionFilter));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  return app;
}

export async function bootstrap() {
  const app = await createApp();
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
  return app;
}

const isDirectExecution =
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (isDirectExecution) {
  await bootstrap();
}
