import { Inject, Injectable } from "@nestjs/common";
import type { GlobalCategoryResponse } from "@padel/schemas";

import { GlobalCategory } from "../domain/global-category.js";
import {
  type GlobalCategoryRepository,
  GlobalCategoryRepositoryToken,
} from "./ports/global-category-repository.js";

export interface CreateGlobalCategoryCommand {
  name: string;
  shortCode: string;
  description?: string;
  skillLevel: number;
  color: string;
  divisions: string[];
  minRanking?: number;
  maxRanking?: number;
  requiresOfficialRanking?: boolean;
  allowCategoryChange?: boolean;
  isActive?: boolean;
}

@Injectable()
export class CreateGlobalCategoryUseCase {
  constructor(
    @Inject(GlobalCategoryRepositoryToken)
    private readonly globalCategoryRepository: GlobalCategoryRepository,
  ) {}

  async execute(
    input: CreateGlobalCategoryCommand,
  ): Promise<GlobalCategoryResponse> {
    const id = await this.globalCategoryRepository.nextId();
    const category = GlobalCategory.create(input, id);

    await this.globalCategoryRepository.create(category);

    return category.toResponse();
  }
}
