import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  categoryCollectionSchema,
  categoryResponseSchema,
  createCategoryRequestSchema,
  updateCategoryRequestSchema,
} from "@padel/schemas";

import { AuthenticatedGuard } from "../../../common/modules/auth/inbound/http/authenticated.guard.js";
import { CreateCategoryUseCase } from "../../application/create-category.use-case.js";
import { DeleteCategoryUseCase } from "../../application/delete-category.use-case.js";
import { ListCategoriesUseCase } from "../../application/list-categories.use-case.js";
import { UpdateCategoryUseCase } from "../../application/update-category.use-case.js";

@Controller("competitions/:competitionId/categories")
export class CategoryController {
  constructor(
    @Inject(CreateCategoryUseCase)
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    @Inject(ListCategoriesUseCase)
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    @Inject(UpdateCategoryUseCase)
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    @Inject(DeleteCategoryUseCase)
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Get()
  @UseGuards(AuthenticatedGuard)
  async listCategories(@Param("competitionId") competitionId: string) {
    const response = await this.listCategoriesUseCase.execute(competitionId);

    return categoryCollectionSchema.parse(response);
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Param("competitionId") competitionId: string,
    @Body() body: unknown,
  ) {
    const request = createCategoryRequestSchema.parse(body);

    const response = await this.createCategoryUseCase.execute({
      competitionId,
      label: request.label,
    });

    return categoryResponseSchema.parse(response);
  }

  @Patch(":categoryId")
  @UseGuards(AuthenticatedGuard)
  async updateCategory(
    @Param("categoryId") categoryId: string,
    @Body() body: unknown,
  ) {
    const request = updateCategoryRequestSchema.parse(body);

    const response = await this.updateCategoryUseCase.execute({
      categoryId,
      label: request.label,
    });

    return categoryResponseSchema.parse(response);
  }

  @Delete(":categoryId")
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param("categoryId") categoryId: string) {
    await this.deleteCategoryUseCase.execute({ categoryId });
  }
}
