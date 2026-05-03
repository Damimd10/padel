import { Inject, Injectable } from "@nestjs/common";
import type { DivisionCollection } from "@padel/schemas";

import {
  type DivisionRepository,
  DivisionRepositoryToken,
} from "./ports/division-repository.js";

@Injectable()
export class ListDivisionsUseCase {
  constructor(
    @Inject(DivisionRepositoryToken)
    private readonly divisionRepository: DivisionRepository,
  ) {}

  async execute(competitionId: string): Promise<DivisionCollection> {
    return this.divisionRepository.listByCompetitionId(competitionId);
  }
}
