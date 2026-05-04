import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";

import { envValidationSchema } from "./common/config/env.validation.js";
import { AuthModule } from "./common/modules/auth/auth.module.js";
import { CoreModule } from "./common/modules/core/core.module.js";
import { CreateCategoryUseCase } from "./competition/application/create-category.use-case.js";
import { CreateCompetitionUseCase } from "./competition/application/create-competition.use-case.js";
import { CreateDivisionUseCase } from "./competition/application/create-division.use-case.js";
import { CreateRegistrationUseCase } from "./competition/application/create-registration.use-case.js";
import { DeleteCategoryUseCase } from "./competition/application/delete-category.use-case.js";
import { DeleteDivisionUseCase } from "./competition/application/delete-division.use-case.js";
import { ListCategoriesUseCase } from "./competition/application/list-categories.use-case.js";
import { ListCompetitionOverviewUseCase } from "./competition/application/list-competition-overview.use-case.js";
import { ListDivisionsUseCase } from "./competition/application/list-divisions.use-case.js";
import { ListRegistrationsUseCase } from "./competition/application/list-registrations.use-case.js";
import { CategoryRepositoryToken } from "./competition/application/ports/category-repository.js";
import { CompetitionRepositoryToken } from "./competition/application/ports/competition-repository.js";
import { DivisionRepositoryToken } from "./competition/application/ports/division-repository.js";
import { RegistrationRepositoryToken } from "./competition/application/ports/registration-repository.js";
import { UpdateCategoryUseCase } from "./competition/application/update-category.use-case.js";
import { UpdateDivisionUseCase } from "./competition/application/update-division.use-case.js";
import { CategoryController } from "./competition/inbound/http/category.controller.js";
import { CompetitionController } from "./competition/inbound/http/competition.controller.js";
import { DivisionController } from "./competition/inbound/http/division.controller.js";
import { RegistrationController } from "./competition/inbound/http/registration.controller.js";
import { PrismaCategoryRepository } from "./competition/outbound/persistence/prisma-category.repository.js";
import { PrismaCompetitionRepository } from "./competition/outbound/persistence/prisma-competition.repository.js";
import { PrismaDivisionRepository } from "./competition/outbound/persistence/prisma-division.repository.js";
import { PrismaRegistrationRepository } from "./competition/outbound/persistence/prisma-registration.repository.js";
import { PrismaModule } from "./prisma/prisma.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../../.env",
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
    AuthModule,
  ],
  controllers: [
    CompetitionController,
    CategoryController,
    DivisionController,
    RegistrationController,
  ],
  providers: [
    CreateCompetitionUseCase,
    ListCompetitionOverviewUseCase,
    PrismaCompetitionRepository,
    {
      provide: CompetitionRepositoryToken,
      useExisting: PrismaCompetitionRepository,
    },
    CreateCategoryUseCase,
    ListCategoriesUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    PrismaCategoryRepository,
    {
      provide: CategoryRepositoryToken,
      useExisting: PrismaCategoryRepository,
    },
    CreateDivisionUseCase,
    ListDivisionsUseCase,
    UpdateDivisionUseCase,
    DeleteDivisionUseCase,
    PrismaDivisionRepository,
    {
      provide: DivisionRepositoryToken,
      useExisting: PrismaDivisionRepository,
    },
    CreateRegistrationUseCase,
    ListRegistrationsUseCase,
    PrismaRegistrationRepository,
    {
      provide: RegistrationRepositoryToken,
      useExisting: PrismaRegistrationRepository,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
