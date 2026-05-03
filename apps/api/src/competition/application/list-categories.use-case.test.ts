import { describe, expect, it } from "vitest";

import { ListCategoriesUseCase } from "./list-categories.use-case.js";
import type { CategoryRepository } from "./ports/category-repository.js";

class FakeCategoryRepository implements CategoryRepository {
  async nextId() {
    return "category-123";
  }

  async create() {
    // no-op
  }

  async listByCompetitionId(competitionId: string) {
    if (competitionId === "comp-1") {
      return [
        {
          id: "cat-1",
          competitionId: "comp-1",
          label: "Segunda",
          createdAt: "2026-05-03T10:00:00.000Z",
          updatedAt: "2026-05-03T10:00:00.000Z",
        },
        {
          id: "cat-2",
          competitionId: "comp-1",
          label: "Tercera",
          createdAt: "2026-05-03T11:00:00.000Z",
          updatedAt: "2026-05-03T11:00:00.000Z",
        },
      ] as const;
    }
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

describe("ListCategoriesUseCase", () => {
  it("returns categories for a competition", async () => {
    const repository = new FakeCategoryRepository();
    const useCase = new ListCategoriesUseCase(repository);

    const result = await useCase.execute("comp-1");

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ label: "Segunda" });
    expect(result[1]).toMatchObject({ label: "Tercera" });
  });

  it("returns empty array for competition with no categories", async () => {
    const repository = new FakeCategoryRepository();
    const useCase = new ListCategoriesUseCase(repository);

    const result = await useCase.execute("comp-999");

    expect(result).toHaveLength(0);
  });
});
