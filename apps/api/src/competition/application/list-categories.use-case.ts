import { Inject, Injectable } from "@nestjs/common";
import type { CategoryCollection } from "@padel/schemas";

import {
  type CategoryRepository,
  CategoryRepositoryToken,
} from "./ports/category-repository.js";

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CategoryRepositoryToken)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(competitionId: string): Promise<CategoryCollection> {
    return this.categoryRepository.listByCompetitionId(competitionId);
  }
}
