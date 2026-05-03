import { NotFoundException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { Category } from "../domain/category.js";
import type { CategoryRepository } from "./ports/category-repository.js";
import { UpdateCategoryUseCase } from "./update-category.use-case.js";

class FakeCategoryRepository implements CategoryRepository {
  updated: unknown[] = [];
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

  async update(category: ReturnType<typeof Category.restore>) {
    this.updated.push(category.toPersistence());
    this.store.set(category.toResponse().id, category);
  }

  async delete() {
    // no-op
  }
}

describe("UpdateCategoryUseCase", () => {
  it("updates a category label", async () => {
    const repository = new FakeCategoryRepository();
    const category = Category.create(
      { competitionId: "comp-1", label: "Segunda" },
      "cat-1",
      "2026-05-03T10:00:00.000Z",
    );
    repository.seed(category);

    const useCase = new UpdateCategoryUseCase(repository);

    const result = await useCase.execute({
      categoryId: "cat-1",
      label: "Segunda A",
    });

    expect(result).toMatchObject({
      id: "cat-1",
      label: "Segunda A",
    });
    expect(repository.updated).toHaveLength(1);
  });

  it("throws if category not found", async () => {
    const repository = new FakeCategoryRepository();
    const useCase = new UpdateCategoryUseCase(repository);

    await expect(
      useCase.execute({ categoryId: "nonexistent", label: "New Label" }),
    ).rejects.toThrow(NotFoundException);
  });
});
