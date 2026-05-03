import type { DivisionCollection } from "@padel/schemas";
import type { Division } from "../../domain/division.js";

export const DivisionRepositoryToken = Symbol("DivisionRepository");

export interface DivisionRepository {
  nextId(): Promise<string>;
  create(division: Division): Promise<void>;
  listByCompetitionId(competitionId: string): Promise<DivisionCollection>;
  findById(id: string): Promise<Division | null>;
  update(division: Division): Promise<void>;
  delete(id: string): Promise<void>;
}
