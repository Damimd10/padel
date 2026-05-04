import type { DivisionCollection } from "@padel/schemas";

import type { Division } from "../../domain/division.js";
import type { DivisionRepository } from "./division-repository.js";

export interface FakeDivisionRepositoryOptions {
  nextId?: string;
  divisionsByCompetition?: Record<string, DivisionCollection>;
  findByIdResult?: Division | null;
  createError?: Error;
  updateError?: Error;
  deleteError?: Error;
}

export class FakeDivisionRepository implements DivisionRepository {
  readonly created: unknown[] = [];
  readonly updated: unknown[] = [];
  readonly deleted: string[] = [];
  private store = new Map<string, Division>();
  private nextIdValue: string;
  private divisionsByCompetition: Record<string, DivisionCollection>;
  private findByIdResult: Division | null;
  private createError?: Error;
  private updateError?: Error;
  private deleteError?: Error;

  constructor(options: FakeDivisionRepositoryOptions = {}) {
    this.nextIdValue = options.nextId ?? "fake-division-id";
    this.divisionsByCompetition = options.divisionsByCompetition ?? {};
    this.findByIdResult = options.findByIdResult ?? null;
    this.createError = options.createError;
    this.updateError = options.updateError;
    this.deleteError = options.deleteError;
  }

  seed(division: Division) {
    this.store.set(division.toResponse().id, division);
  }

  async nextId() {
    return this.nextIdValue;
  }

  async create(division: Division): Promise<void> {
    if (this.createError) throw this.createError;
    this.created.push(division.toPersistence());
    this.store.set(division.toResponse().id, division);
  }

  async listByCompetitionId(
    competitionId: string,
  ): Promise<DivisionCollection> {
    const stored = this.storeByCompetition(competitionId);
    if (stored.length > 0) return stored;
    return this.divisionsByCompetition[competitionId] ?? [];
  }

  async findById(id: string): Promise<Division | null> {
    const fromStore = this.store.get(id);
    if (fromStore) return fromStore;
    return this.findByIdResult;
  }

  async update(division: Division): Promise<void> {
    if (this.updateError) throw this.updateError;
    this.updated.push(division.toPersistence());
    this.store.set(division.toResponse().id, division);
  }

  async delete(id: string): Promise<void> {
    if (this.deleteError) throw this.deleteError;
    this.deleted.push(id);
    this.store.delete(id);
  }

  private storeByCompetition(competitionId: string): DivisionCollection {
    const divisions: DivisionCollection = [];
    for (const division of this.store.values()) {
      if (division.toResponse().competitionId === competitionId) {
        divisions.push(division.toResponse());
      }
    }
    return divisions;
  }
}
