import type { CategoryCollection } from "@padel/schemas";

import type { Category } from "../../domain/category.js";
import type { CategoryRepository } from "./category-repository.js";

export interface FakeCategoryRepositoryOptions {
  nextId?: string;
  categoriesByCompetition?: Record<string, CategoryCollection>;
  findByIdResult?: Category | null;
  createError?: Error;
  updateError?: Error;
  deleteError?: Error;
}

export class FakeCategoryRepository implements CategoryRepository {
  readonly created: unknown[] = [];
  readonly updated: unknown[] = [];
  readonly deleted: string[] = [];
  private store = new Map<string, Category>();
  private nextIdValue: string;
  private categoriesByCompetition: Record<string, CategoryCollection>;
  private findByIdResult: Category | null;
  private createError?: Error;
  private updateError?: Error;
  private deleteError?: Error;

  constructor(options: FakeCategoryRepositoryOptions = {}) {
    this.nextIdValue = options.nextId ?? "fake-category-id";
    this.categoriesByCompetition = options.categoriesByCompetition ?? {};
    this.findByIdResult = options.findByIdResult ?? null;
    this.createError = options.createError;
    this.updateError = options.updateError;
    this.deleteError = options.deleteError;
  }

  seed(category: Category) {
    this.store.set(category.toResponse().id, category);
  }

  async nextId() {
    return this.nextIdValue;
  }

  async create(category: Category): Promise<void> {
    if (this.createError) throw this.createError;
    this.created.push(category.toPersistence());
    this.store.set(category.toResponse().id, category);
  }

  async listByCompetitionId(competitionId: string): Promise<CategoryCollection> {
    const stored = this.storeByCompetition(competitionId);
    if (stored.length > 0) return stored;
    return this.categoriesByCompetition[competitionId] ?? [];
  }

  async findById(id: string): Promise<Category | null> {
    const fromStore = this.store.get(id);
    if (fromStore) return fromStore;
    return this.findByIdResult;
  }

  async update(category: Category): Promise<void> {
    if (this.updateError) throw this.updateError;
    this.updated.push(category.toPersistence());
    this.store.set(category.toResponse().id, category);
  }

  async delete(id: string): Promise<void> {
    if (this.deleteError) throw this.deleteError;
    this.deleted.push(id);
    this.store.delete(id);
  }

  private storeByCompetition(competitionId: string): CategoryCollection {
    const categories: CategoryCollection = [];
    for (const category of this.store.values()) {
      if (category.toResponse().competitionId === competitionId) {
        categories.push(category.toResponse());
      }
    }
    return categories;
  }
}
