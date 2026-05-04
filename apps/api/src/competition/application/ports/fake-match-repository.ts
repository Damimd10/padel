import type { Match } from "../../domain/match.js";
import type { MatchRepository } from "./match-repository.js";

export class FakeMatchRepository implements MatchRepository {
  private matches = new Map<string, Match>();

  async nextId() {
    return crypto.randomUUID();
  }

  async create(match: Match) {
    this.matches.set(match.id, match);
  }

  async save(match: Match) {
    this.matches.set(match.id, match);
  }

  async findByCompetition(competitionId: string) {
    return [...this.matches.values()].filter(
      (m) => m.competitionId === competitionId,
    );
  }

  async findById(id: string) {
    return this.matches.get(id) ?? null;
  }

  clear() {
    this.matches.clear();
  }
}
