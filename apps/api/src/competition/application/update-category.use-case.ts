import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { CategoryResponse } from "@padel/schemas";

import {
  type CategoryRepository,
  CategoryRepositoryToken,
} from "./ports/category-repository.js";

export interface UpdateCategoryCommand {
  categoryId: string;
  label: string;
}

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CategoryRepositoryToken)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: UpdateCategoryCommand): Promise<CategoryResponse> {
    const existing = await this.categoryRepository.findById(input.categoryId);

    if (!existing) {
      throw new NotFoundException("Category not found.");
    }

    const now = new Date().toISOString();
    const updated = existing.update({ label: input.label }, now);

    await this.categoryRepository.update(updated);

    return updated.toResponse();
  }
}
