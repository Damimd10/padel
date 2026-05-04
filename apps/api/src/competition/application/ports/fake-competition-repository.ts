import type { CompetitionOverviewCollection } from "@padel/schemas";
import type { Competition } from "../../domain/competition.js";
import type { CompetitionRepository } from "./competition-repository.js";

export class FakeCompetitionRepository implements CompetitionRepository {
  private competitions = new Map<string, Competition>();

  async nextId() {
    return crypto.randomUUID();
  }

  async create(competition: Competition) {
    this.competitions.set(competition.id, competition);
  }

  async save(competition: Competition) {
    this.competitions.set(competition.id, competition);
  }

  async listOverview(): Promise<CompetitionOverviewCollection> {
    return [];
  }

  async findById(id: string) {
    return this.competitions.get(id) ?? null;
  }

  async findByIdWithCounts(id: string) {
    return this.competitions.get(id) ?? null;
  }
}
