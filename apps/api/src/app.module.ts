import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";

import { envValidationSchema } from "./common/config/env.validation.js";
import { AuthModule } from "./common/modules/auth/auth.module.js";
import { CoreModule } from "./common/modules/core/core.module.js";
import { ApproveRegistrationUseCase } from "./competition/application/approve-registration.use-case.js";
import { CancelCompetitionUseCase } from "./competition/application/cancel-competition.use-case.js";
import { CloseCompetitionUseCase } from "./competition/application/close-competition.use-case.js";
import { CreateCategoryUseCase } from "./competition/application/create-category.use-case.js";
import { CreateCompetitionUseCase } from "./competition/application/create-competition.use-case.js";
import { CreateDivisionUseCase } from "./competition/application/create-division.use-case.js";
import { CreateGlobalCategoryUseCase } from "./competition/application/create-global-category.use-case.js";
import { CreateRegistrationUseCase } from "./competition/application/create-registration.use-case.js";
import { DeleteCategoryUseCase } from "./competition/application/delete-category.use-case.js";
import { DeleteDivisionUseCase } from "./competition/application/delete-division.use-case.js";
import { GenerateMatchesUseCase } from "./competition/application/generate-matches.use-case.js";
import { ListCategoriesUseCase } from "./competition/application/list-categories.use-case.js";
import { ListCompetitionOverviewUseCase } from "./competition/application/list-competition-overview.use-case.js";
import { ListDivisionsUseCase } from "./competition/application/list-divisions.use-case.js";
import { ListGlobalCategoriesUseCase } from "./competition/application/list-global-categories.use-case.js";
import { ListMatchesUseCase } from "./competition/application/list-matches.use-case.js";
import { ListRegistrationsUseCase } from "./competition/application/list-registrations.use-case.js";
import { OpenCompetitionUseCase } from "./competition/application/open-competition.use-case.js";
import { CategoryRepositoryToken } from "./competition/application/ports/category-repository.js";
import { CompetitionRepositoryToken } from "./competition/application/ports/competition-repository.js";
import { DivisionRepositoryToken } from "./competition/application/ports/division-repository.js";
import { GlobalCategoryRepositoryToken } from "./competition/application/ports/global-category-repository.js";
import { MatchRepositoryToken } from "./competition/application/ports/match-repository.js";
import { RegistrationRepositoryToken } from "./competition/application/ports/registration-repository.js";
import { RejectRegistrationUseCase } from "./competition/application/reject-registration.use-case.js";
import { UpdateCategoryUseCase } from "./competition/application/update-category.use-case.js";
import { UpdateDivisionUseCase } from "./competition/application/update-division.use-case.js";
import { UpdateMatchUseCase } from "./competition/application/update-match.use-case.js";
import { CategoryController } from "./competition/inbound/http/category.controller.js";
import { CompetitionController } from "./competition/inbound/http/competition.controller.js";
import { DivisionController } from "./competition/inbound/http/division.controller.js";
import { GlobalCategoryController } from "./competition/inbound/http/global-category.controller.js";
import { MatchController } from "./competition/inbound/http/match.controller.js";
import { RegistrationController } from "./competition/inbound/http/registration.controller.js";
import { PrismaCategoryRepository } from "./competition/outbound/persistence/prisma-category.repository.js";
import { PrismaCompetitionRepository } from "./competition/outbound/persistence/prisma-competition.repository.js";
import { PrismaDivisionRepository } from "./competition/outbound/persistence/prisma-division.repository.js";
import { PrismaGlobalCategoryRepository } from "./competition/outbound/persistence/prisma-global-category.repository.js";
import { PrismaMatchRepository } from "./competition/outbound/persistence/prisma-match.repository.js";
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
    MatchController,
    GlobalCategoryController,
  ],
  providers: [
    CreateCompetitionUseCase,
    ListCompetitionOverviewUseCase,
    OpenCompetitionUseCase,
    CloseCompetitionUseCase,
    CancelCompetitionUseCase,
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
    ApproveRegistrationUseCase,
    RejectRegistrationUseCase,
    PrismaRegistrationRepository,
    {
      provide: RegistrationRepositoryToken,
      useExisting: PrismaRegistrationRepository,
    },
    GenerateMatchesUseCase,
    ListMatchesUseCase,
    UpdateMatchUseCase,
    PrismaMatchRepository,
    {
      provide: MatchRepositoryToken,
      useExisting: PrismaMatchRepository,
    },
    CreateGlobalCategoryUseCase,
    ListGlobalCategoriesUseCase,
    PrismaGlobalCategoryRepository,
    {
      provide: GlobalCategoryRepositoryToken,
      useExisting: PrismaGlobalCategoryRepository,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
