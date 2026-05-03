import type { CategoryCollection } from "@padel/schemas";
import type { Category } from "../../domain/category.js";

export const CategoryRepositoryToken = Symbol("CategoryRepository");

export interface CategoryRepository {
  nextId(): Promise<string>;
  create(category: Category): Promise<void>;
  listByCompetitionId(competitionId: string): Promise<CategoryCollection>;
  findById(id: string): Promise<Category | null>;
  update(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
}
