import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  competitionOverviewCollectionSchema,
  competitionStatusTransitionResponseSchema,
  createCompetitionRequestSchema,
  createCompetitionResponseSchema,
} from "@padel/schemas";

import type { AuthenticatedUser } from "../../../common/modules/auth/application/ports/auth-gateway.port.js";
import { AuthenticatedGuard } from "../../../common/modules/auth/inbound/http/authenticated.guard.js";
import { CurrentUser } from "../../../common/modules/auth/inbound/http/current-user.decorator.js";
import { CancelCompetitionUseCase } from "../../application/cancel-competition.use-case.js";
import { CloseCompetitionUseCase } from "../../application/close-competition.use-case.js";
import { CreateCompetitionUseCase } from "../../application/create-competition.use-case.js";
import { ListCompetitionOverviewUseCase } from "../../application/list-competition-overview.use-case.js";
import { OpenCompetitionUseCase } from "../../application/open-competition.use-case.js";
import { mapCreateCompetitionRequestToCommand } from "./create-competition-request.mapper.js";

@Controller("competitions")
export class CompetitionController {
  constructor(
    @Inject(CreateCompetitionUseCase)
    private readonly createCompetitionUseCase: CreateCompetitionUseCase,
    @Inject(ListCompetitionOverviewUseCase)
    private readonly listCompetitionOverviewUseCase: ListCompetitionOverviewUseCase,
    @Inject(OpenCompetitionUseCase)
    private readonly openCompetitionUseCase: OpenCompetitionUseCase,
    @Inject(CloseCompetitionUseCase)
    private readonly closeCompetitionUseCase: CloseCompetitionUseCase,
    @Inject(CancelCompetitionUseCase)
    private readonly cancelCompetitionUseCase: CancelCompetitionUseCase,
  ) {}

  @Get()
  @UseGuards(AuthenticatedGuard)
  async listCompetitionOverview() {
    const response = await this.listCompetitionOverviewUseCase.execute();

    return competitionOverviewCollectionSchema.parse(response);
  }

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

  @Patch(":competitionId/open")
  @UseGuards(AuthenticatedGuard)
  async openCompetition(@Param("competitionId") competitionId: string) {
    const response = await this.openCompetitionUseCase.execute({
      competitionId,
    });

    return competitionStatusTransitionResponseSchema.parse(response);
  }

  @Patch(":competitionId/close")
  @UseGuards(AuthenticatedGuard)
  async closeCompetition(@Param("competitionId") competitionId: string) {
    const response = await this.closeCompetitionUseCase.execute({
      competitionId,
    });

    return competitionStatusTransitionResponseSchema.parse(response);
  }

  @Patch(":competitionId/cancel")
  @UseGuards(AuthenticatedGuard)
  async cancelCompetition(@Param("competitionId") competitionId: string) {
    const response = await this.cancelCompetitionUseCase.execute({
      competitionId,
    });

    return competitionStatusTransitionResponseSchema.parse(response);
  }
}
