import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { RegistrationCollection } from "@padel/schemas";
import type { Competition } from "../domain/competition.js";
import { Match } from "../domain/match.js";
import {
  type CompetitionRepository,
  CompetitionRepositoryToken,
} from "./ports/competition-repository.js";
import type { MatchRepository } from "./ports/match-repository.js";
import { MatchRepositoryToken } from "./ports/match-repository.js";
import type { RegistrationRepository } from "./ports/registration-repository.js";
import { RegistrationRepositoryToken } from "./ports/registration-repository.js";

export interface GenerateMatchesCommand {
  competitionId: string;
}

@Injectable()
export class GenerateMatchesUseCase {
  constructor(
    @Inject(CompetitionRepositoryToken)
    private readonly competitionRepository: CompetitionRepository,
    @Inject(MatchRepositoryToken)
    private readonly matchRepository: MatchRepository,
    @Inject(RegistrationRepositoryToken)
    private readonly registrationRepository: RegistrationRepository,
  ) {}

  async execute(
    command: GenerateMatchesCommand,
  ): Promise<{ matchCount: number }> {
    const competition = await this.competitionRepository.findByIdWithCounts(
      command.competitionId,
    );

    if (!competition) {
      throw new NotFoundException("Competition not found.");
    }

    if (competition.status !== "closed") {
      throw new Error(
        `Competition must be in closed status to generate matches. Current status: ${competition.status}`,
      );
    }

    const registrations = await this.registrationRepository.findByCompetitionId(
      command.competitionId,
    );

    const approved = registrations.filter((r) => r.status === "approved");

    if (approved.length < 2) {
      throw new Error(
        "Competition must have at least two approved registrations to generate matches.",
      );
    }

    const format = competition.toResponse().format;
    const groups = this.groupRegistrations(approved);
    const matches: Match[] = [];

    for (const group of groups) {
      const groupMatches = this.generateMatchesForGroup(
        command.competitionId,
        group,
        format,
      );
      matches.push(...groupMatches);
    }

    for (const match of matches) {
      await this.matchRepository.create(match);
    }

    return { matchCount: matches.length };
  }

  private groupRegistrations(
    registrations: RegistrationCollection,
  ): Array<RegistrationCollection> {
    const groupMap = new Map<string, RegistrationCollection>();

    for (const reg of registrations) {
      const key = `${reg.categoryId}-${reg.divisionId}`;
      if (!groupMap.has(key)) {
        groupMap.set(key, []);
      }
      const group = groupMap.get(key);
      if (group) {
        group.push(reg);
      }
    }

    return [...groupMap.values()];
  }

  private generateMatchesForGroup(
    competitionId: string,
    registrations: RegistrationCollection,
    format: "elimination" | "round-robin" | "league",
  ): Match[] {
    const matches: Match[] = [];

    switch (format) {
      case "round-robin":
        for (let i = 0; i < registrations.length; i++) {
          for (let j = i + 1; j < registrations.length; j++) {
            const match = Match.create(
              competitionId,
              registrations[i].id,
              registrations[j].id,
              crypto.randomUUID(),
            );
            matches.push(match);
          }
        }
        break;

      case "elimination":
        for (let i = 0; i < registrations.length - 1; i += 2) {
          const match = Match.create(
            competitionId,
            registrations[i].id,
            registrations[i + 1].id,
            crypto.randomUUID(),
          );
          matches.push(match);
        }
        break;

      case "league":
        for (let i = 0; i < registrations.length; i++) {
          for (let j = i + 1; j < registrations.length; j++) {
            const match1 = Match.create(
              competitionId,
              registrations[i].id,
              registrations[j].id,
              crypto.randomUUID(),
            );
            const match2 = Match.create(
              competitionId,
              registrations[j].id,
              registrations[i].id,
              crypto.randomUUID(),
            );
            matches.push(match1, match2);
          }
        }
        break;
    }

    return matches;
  }
}
