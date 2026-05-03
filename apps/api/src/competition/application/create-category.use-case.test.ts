import { describe, expect, it } from "vitest";

import type { CreateCategoryCommand } from "./create-category.use-case.js";
import { CreateCategoryUseCase } from "./create-category.use-case.js";
import type { CategoryRepository } from "./ports/category-repository.js";

class FakeCategoryRepository implements CategoryRepository {
  created: unknown[] = [];

  async nextId() {
    return "category-123";
  }

  async create(category: { toPersistence(): unknown }): Promise<void> {
    this.created.push(category.toPersistence());
  }

  async listByCompetitionId() {
    return [];
  }

  async findById() {
    return null;
  }

  async update() {
    // no-op
  }

  async delete() {
    // no-op
  }
}

describe("CreateCategoryUseCase", () => {
  it("creates and persists a category", async () => {
    const repository = new FakeCategoryRepository();
    const useCase = new CreateCategoryUseCase(repository);

    const result = await useCase.execute({
      competitionId: "comp-1",
      label: "Segunda",
    } satisfies CreateCategoryCommand);

    expect(result).toMatchObject({
      id: "category-123",
      competitionId: "comp-1",
      label: "Segunda",
    });
    expect(repository.created).toHaveLength(1);
  });
});
