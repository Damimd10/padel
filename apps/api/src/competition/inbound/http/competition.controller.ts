import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from "@nestjs/common";
import {
  type CreateCompetitionInput,
  createCompetitionRequestSchema,
  createCompetitionResponseSchema,
} from "@padel/schemas";

import { CreateCompetitionUseCase } from "../../application/create-competition.use-case.js";

@Controller("competitions")
export class CompetitionController {
  constructor(
    @Inject(CreateCompetitionUseCase)
    private readonly createCompetitionUseCase: CreateCompetitionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCompetition(@Body() body: unknown) {
    const input: CreateCompetitionInput =
      createCompetitionRequestSchema.parse(body);

    const response = await this.createCompetitionUseCase.execute(input);

    return createCompetitionResponseSchema.parse(response);
  }
}
