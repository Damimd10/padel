import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import {
  type CompetitionRepository,
  CompetitionRepositoryToken,
} from "./ports/competition-repository.js";

export interface CloseCompetitionCommand {
  competitionId: string;
}

@Injectable()
export class CloseCompetitionUseCase {
  constructor(
    @Inject(CompetitionRepositoryToken)
    private readonly competitionRepository: CompetitionRepository,
  ) {}

  async execute(
    command: CloseCompetitionCommand,
  ): Promise<{ status: "closed" }> {
    const competition = await this.competitionRepository.findById(
      command.competitionId,
    );

    if (!competition) {
      throw new NotFoundException("Competition not found.");
    }

    competition.close();

    await this.competitionRepository.save(competition);

    return { status: "closed" };
  }
}
