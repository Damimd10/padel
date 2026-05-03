import { describe, expect, it } from "vitest";

import type { CreateCategoryCommand } from "./create-category.use-case.js";
import { CreateCategoryUseCase } from "./create-category.use-case.js";
import { FakeCategoryRepository } from "./ports/fake-category-repository.js";

describe("CreateCategoryUseCase", () => {
  it("creates and persists a category", async () => {
    const repository = new FakeCategoryRepository({ nextId: "category-123" });
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
