import { describe, expect, it } from "vitest";

import { ListCategoriesUseCase } from "./list-categories.use-case.js";
import { FakeCategoryRepository } from "./ports/fake-category-repository.js";

describe("ListCategoriesUseCase", () => {
  it("returns categories for a competition", async () => {
    const repository = new FakeCategoryRepository({
      categoriesByCompetition: {
        "comp-1": [
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
        ],
      },
    });
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
