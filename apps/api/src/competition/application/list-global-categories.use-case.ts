import { Inject, Injectable } from "@nestjs/common";
import type { GlobalCategoryCollection } from "@padel/schemas";

import {
  type GlobalCategoryRepository,
  GlobalCategoryRepositoryToken,
} from "./ports/global-category-repository.js";

@Injectable()
export class ListGlobalCategoriesUseCase {
  constructor(
    @Inject(GlobalCategoryRepositoryToken)
    private readonly globalCategoryRepository: GlobalCategoryRepository,
  ) {}

  async execute(): Promise<GlobalCategoryCollection> {
    return this.globalCategoryRepository.listAll();
  }
}
