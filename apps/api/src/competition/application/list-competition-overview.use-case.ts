import { Inject, Injectable } from "@nestjs/common";
import type { CompetitionOverviewCollection } from "@padel/schemas";

import {
  type CompetitionRepository,
  CompetitionRepositoryToken,
} from "./ports/competition-repository.js";

@Injectable()
export class ListCompetitionOverviewUseCase {
  constructor(
    @Inject(CompetitionRepositoryToken)
    private readonly competitionRepository: CompetitionRepository,
  ) {}

  async execute(): Promise<CompetitionOverviewCollection> {
    return this.competitionRepository.listOverview();
  }
}
