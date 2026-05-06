import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  createGlobalCategoryRequestSchema,
  globalCategoryCollectionSchema,
  globalCategoryResponseSchema,
} from "@padel/schemas";

import { AuthenticatedGuard } from "../../../common/modules/auth/inbound/http/authenticated.guard.js";
import { CreateGlobalCategoryUseCase } from "../../application/create-global-category.use-case.js";
import { ListGlobalCategoriesUseCase } from "../../application/list-global-categories.use-case.js";

@Controller("categories")
export class GlobalCategoryController {
  constructor(
    @Inject(CreateGlobalCategoryUseCase)
    private readonly createGlobalCategoryUseCase: CreateGlobalCategoryUseCase,
    @Inject(ListGlobalCategoriesUseCase)
    private readonly listGlobalCategoriesUseCase: ListGlobalCategoriesUseCase,
  ) {}

  @Get()
  @UseGuards(AuthenticatedGuard)
  async listCategories() {
    const response = await this.listGlobalCategoriesUseCase.execute();
    return globalCategoryCollectionSchema.parse(response);
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() body: unknown) {
    const request = createGlobalCategoryRequestSchema.parse(body);

    const response = await this.createGlobalCategoryUseCase.execute({
      name: request.name,
      shortCode: request.shortCode,
      description: request.description,
      skillLevel: request.skillLevel,
      color: request.color,
      divisions: request.divisions,
      minRanking: request.minRanking,
      maxRanking: request.maxRanking,
      requiresOfficialRanking: request.requiresOfficialRanking,
      allowCategoryChange: request.allowCategoryChange,
      isActive: request.isActive,
    });

    return globalCategoryResponseSchema.parse(response);
  }
}
