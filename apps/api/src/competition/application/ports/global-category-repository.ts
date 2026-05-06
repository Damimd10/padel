import type { GlobalCategoryCollection } from "@padel/schemas";
import type { GlobalCategory } from "../../domain/global-category.js";

export const GlobalCategoryRepositoryToken = Symbol("GlobalCategoryRepository");

export interface GlobalCategoryRepository {
  nextId(): Promise<string>;
  create(category: GlobalCategory): Promise<void>;
  listAll(): Promise<GlobalCategoryCollection>;
}
