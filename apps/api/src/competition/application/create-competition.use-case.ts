import { Inject, Injectable } from "@nestjs/common";
import type {
  CreateCompetitionInput,
  CreateCompetitionResponse,
} from "@padel/schemas";

import { Competition } from "../domain/competition.js";
import {
  type CompetitionRepository,
  CompetitionRepositoryToken,
} from "./ports/competition-repository.js";

@Injectable()
export class CreateCompetitionUseCase {
  constructor(
    @Inject(CompetitionRepositoryToken)
    private readonly competitionRepository: CompetitionRepository,
  ) {}

  async execute(
    input: CreateCompetitionInput,
  ): Promise<CreateCompetitionResponse> {
    const id = await this.competitionRepository.nextId();
    const competition = Competition.createDraft(input, id);

    await this.competitionRepository.create(competition);

    return competition.toResponse();
  }
}
