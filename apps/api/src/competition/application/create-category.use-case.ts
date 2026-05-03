import { Inject, Injectable } from "@nestjs/common";
import type { CategoryResponse } from "@padel/schemas";

import { Category } from "../domain/category.js";
import {
  type CategoryRepository,
  CategoryRepositoryToken,
} from "./ports/category-repository.js";

export interface CreateCategoryCommand {
  competitionId: string;
  label: string;
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CategoryRepositoryToken)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: CreateCategoryCommand): Promise<CategoryResponse> {
    const id = await this.categoryRepository.nextId();
    const now = new Date().toISOString();
    const category = Category.create(input, id, now);

    await this.categoryRepository.create(category);

    return category.toResponse();
  }
}
