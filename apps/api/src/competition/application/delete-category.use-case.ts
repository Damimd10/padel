import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import {
  type CategoryRepository,
  CategoryRepositoryToken,
} from "./ports/category-repository.js";

export interface DeleteCategoryCommand {
  categoryId: string;
}

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CategoryRepositoryToken)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: DeleteCategoryCommand): Promise<void> {
    const existing = await this.categoryRepository.findById(input.categoryId);

    if (!existing) {
      throw new NotFoundException("Category not found.");
    }

    await this.categoryRepository.delete(input.categoryId);
  }
}
