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
  completeMatchRequestSchema,
  generateMatchesResponseSchema,
  matchCollectionSchema,
  scheduleMatchRequestSchema,
} from "@padel/schemas";

import { AuthenticatedGuard } from "../../../common/modules/auth/inbound/http/authenticated.guard.js";
import { GenerateMatchesUseCase } from "../../application/generate-matches.use-case.js";
import { ListMatchesUseCase } from "../../application/list-matches.use-case.js";
import { UpdateMatchUseCase } from "../../application/update-match.use-case.js";

@Controller("competitions/:competitionId/matches")
export class MatchController {
  constructor(
    @Inject(GenerateMatchesUseCase)
    private readonly generateMatchesUseCase: GenerateMatchesUseCase,
    @Inject(ListMatchesUseCase)
    private readonly listMatchesUseCase: ListMatchesUseCase,
    @Inject(UpdateMatchUseCase)
    private readonly updateMatchUseCase: UpdateMatchUseCase,
  ) {}

  @Post("generate")
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.CREATED)
  async generateMatches(@Param("competitionId") competitionId: string) {
    const response = await this.generateMatchesUseCase.execute({
      competitionId,
    });

    return generateMatchesResponseSchema.parse(response);
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  async listMatches(@Param("competitionId") competitionId: string) {
    const matches = await this.listMatchesUseCase.execute({
      competitionId,
    });

    const response = matches.map((m) => m.toResponse());
    return matchCollectionSchema.parse(response);
  }

  @Patch(":matchId/schedule")
  @UseGuards(AuthenticatedGuard)
  async scheduleMatch(
    @Param("competitionId") _competitionId: string,
    @Param("matchId") matchId: string,
    @Body() body: unknown,
  ) {
    const request = scheduleMatchRequestSchema.parse(body);

    const response = await this.updateMatchUseCase.schedule({
      matchId,
      scheduledAt: request.scheduledAt,
    });

    return response;
  }

  @Patch(":matchId/start")
  @UseGuards(AuthenticatedGuard)
  async startMatch(
    @Param("competitionId") _competitionId: string,
    @Param("matchId") matchId: string,
  ) {
    const response = await this.updateMatchUseCase.start({
      matchId,
    });

    return response;
  }

  @Patch(":matchId/complete")
  @UseGuards(AuthenticatedGuard)
  async completeMatch(
    @Param("competitionId") _competitionId: string,
    @Param("matchId") matchId: string,
    @Body() body: unknown,
  ) {
    const request = completeMatchRequestSchema.parse(body);

    const response = await this.updateMatchUseCase.complete({
      matchId,
      scoreA: request.scoreA,
      scoreB: request.scoreB,
    });

    return response;
  }

  @Patch(":matchId/cancel")
  @UseGuards(AuthenticatedGuard)
  async cancelMatch(
    @Param("competitionId") _competitionId: string,
    @Param("matchId") matchId: string,
  ) {
    const response = await this.updateMatchUseCase.cancel({
      matchId,
    });

    return response;
  }
}
