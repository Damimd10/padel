import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  createRegistrationRequestSchema,
  registrationCollectionSchema,
  registrationResponseSchema,
} from "@padel/schemas";

import type { AuthenticatedUser } from "../../../common/modules/auth/application/ports/auth-gateway.port.js";
import { AuthenticatedGuard } from "../../../common/modules/auth/inbound/http/authenticated.guard.js";
import { CurrentUser } from "../../../common/modules/auth/inbound/http/current-user.decorator.js";
import { CreateRegistrationUseCase } from "../../application/create-registration.use-case.js";
import { ListRegistrationsUseCase } from "../../application/list-registrations.use-case.js";

@Controller("competitions/:competitionId/registrations")
export class RegistrationController {
  constructor(
    @Inject(CreateRegistrationUseCase)
    private readonly createRegistrationUseCase: CreateRegistrationUseCase,
    @Inject(ListRegistrationsUseCase)
    private readonly listRegistrationsUseCase: ListRegistrationsUseCase,
  ) {}

  @Get()
  @UseGuards(AuthenticatedGuard)
  async listRegistrations(@Param("competitionId") competitionId: string) {
    const response = await this.listRegistrationsUseCase.execute(competitionId);

    return registrationCollectionSchema.parse(response);
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRegistration(
    @Param("competitionId") competitionId: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser | undefined,
  ) {
    const request = createRegistrationRequestSchema.parse(body);
    const participantId = user?.id;

    if (
      typeof participantId !== "string" ||
      participantId.trim().length === 0
    ) {
      throw new Error("Authenticated participant identity is required.");
    }

    const response = await this.createRegistrationUseCase.execute({
      competitionId,
      participantId,
      categoryId: request.categoryId,
      divisionId: request.divisionId,
    });

    return registrationResponseSchema.parse(response);
  }
}
