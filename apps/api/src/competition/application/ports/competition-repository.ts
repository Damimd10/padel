import type { CompetitionOverviewCollection } from "@padel/schemas";
import type { Competition } from "../../domain/competition.js";

export const CompetitionRepositoryToken = Symbol("CompetitionRepository");

export interface CompetitionRepository {
  nextId(): Promise<string>;
  create(competition: Competition): Promise<void>;
  listOverview(): Promise<CompetitionOverviewCollection>;
}
