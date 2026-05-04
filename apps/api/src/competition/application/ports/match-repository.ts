import type { Match } from "../../domain/match.js";

export const MatchRepositoryToken = Symbol("MatchRepository");

export interface MatchRepository {
  nextId(): Promise<string>;
  create(match: Match): Promise<void>;
  save(match: Match): Promise<void>;
  findByCompetition(competitionId: string): Promise<Match[]>;
  findById(id: string): Promise<Match | null>;
}
