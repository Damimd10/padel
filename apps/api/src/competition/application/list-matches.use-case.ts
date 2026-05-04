import { Inject, Injectable } from "@nestjs/common";
import type { Match } from "../domain/match.js";
import type { MatchRepository } from "./ports/match-repository.js";
import { MatchRepositoryToken } from "./ports/match-repository.js";

export interface ListMatchesCommand {
  competitionId: string;
}

@Injectable()
export class ListMatchesUseCase {
  constructor(
    @Inject(MatchRepositoryToken)
    private readonly matchRepository: MatchRepository,
  ) {}

  async execute(command: ListMatchesCommand): Promise<Match[]> {
    return this.matchRepository.findByCompetition(command.competitionId);
  }
}
