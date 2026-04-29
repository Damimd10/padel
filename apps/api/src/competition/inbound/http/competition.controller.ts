import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  createCompetitionRequestSchema,
  createCompetitionResponseSchema,
} from "@padel/schemas";

import type { AuthenticatedUser } from "../../../common/modules/auth/application/ports/auth-gateway.port.js";
import { CurrentUser } from "../../../common/modules/auth/inbound/http/current-user.decorator.js";
import { AuthenticatedGuard } from "../../../common/modules/auth/inbound/http/authenticated.guard.js";
import { CreateCompetitionUseCase } from "../../application/create-competition.use-case.js";
import { mapCreateCompetitionRequestToCommand } from "./create-competition-request.mapper.js";

@Controller("competitions")
export class CompetitionController {
  constructor(
    @Inject(CreateCompetitionUseCase)
    private readonly createCompetitionUseCase: CreateCompetitionUseCase,
  ) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.CREATED)
  async createCompetition(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser | undefined,
  ) {
    const request = createCompetitionRequestSchema.parse(body);
    const input = mapCreateCompetitionRequestToCommand(request, user);

    const response = await this.createCompetitionUseCase.execute(input);

    return createCompetitionResponseSchema.parse(response);
  }
}
