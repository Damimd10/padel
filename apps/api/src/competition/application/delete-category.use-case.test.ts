import { NotFoundException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { Category } from "../domain/category.js";
import { DeleteCategoryUseCase } from "./delete-category.use-case.js";
import type { CategoryRepository } from "./ports/category-repository.js";

class FakeCategoryRepository implements CategoryRepository {
  deleted: string[] = [];
  private store = new Map<string, ReturnType<typeof Category.restore>>();

  seed(category: ReturnType<typeof Category.restore>) {
    this.store.set(category.toResponse().id, category);
  }

  async nextId() {
    return "category-123";
  }

  async create(category: ReturnType<typeof Category.restore>) {
    this.store.set(category.toResponse().id, category);
  }

  async listByCompetitionId() {
    return [];
  }

  async findById(id: string) {
    return this.store.get(id) ?? null;
  }

  async update() {
    // no-op
  }

  async delete(id: string) {
    this.deleted.push(id);
  }
}

describe("DeleteCategoryUseCase", () => {
  it("deletes an existing category", async () => {
    const repository = new FakeCategoryRepository();
    const category = Category.create(
      { competitionId: "comp-1", label: "Segunda" },
      "cat-1",
      "2026-05-03T10:00:00.000Z",
    );
    repository.seed(category);

    const useCase = new DeleteCategoryUseCase(repository);

    await useCase.execute({ categoryId: "cat-1" });

    expect(repository.deleted).toContain("cat-1");
  });

  it("throws if category not found", async () => {
    const repository = new FakeCategoryRepository();
    const useCase = new DeleteCategoryUseCase(repository);

    await expect(
      useCase.execute({ categoryId: "nonexistent" }),
    ).rejects.toThrow(NotFoundException);
  });
});
