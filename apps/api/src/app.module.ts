import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";

import { envValidationSchema } from "./common/config/env.validation.js";
import { CoreModule } from "./common/modules/core/core.module.js";
import { CreateCompetitionUseCase } from "./competition/application/create-competition.use-case.js";
import { CompetitionRepositoryToken } from "./competition/application/ports/competition-repository.js";
import { CompetitionController } from "./competition/inbound/http/competition.controller.js";
import { PrismaCompetitionRepository } from "./competition/outbound/persistence/prisma-competition.repository.js";
import { PrismaModule } from "./prisma/prisma.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const level = configService.get<string>("LOG_LEVEL", "info");
        const useJson = configService.get<boolean>("LOG_JSON", true);

        return {
          pinoHttp: {
            level,
            timestamp: true,
            redact: {
              paths: [
                "req.headers.authorization",
                "req.headers.cookie",
                'res.headers["set-cookie"]',
              ],
              censor: "[Redacted]",
            },
            ...(useJson
              ? {}
              : {
                  transport: {
                    target: "pino-pretty",
                    options: {
                      colorize: true,
                      translateTime: "SYS:standard",
                      singleLine: true,
                    },
                  },
                }),
          },
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>("API_RATE_LIMIT_TTL_MS", 60_000),
            limit: configService.get<number>("API_RATE_LIMIT_MAX", 100),
          },
        ],
      }),
    }),
    CoreModule,
    PrismaModule,
  ],
  controllers: [CompetitionController],
  providers: [
    CreateCompetitionUseCase,
    PrismaCompetitionRepository,
    {
      provide: CompetitionRepositoryToken,
      useExisting: PrismaCompetitionRepository,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
