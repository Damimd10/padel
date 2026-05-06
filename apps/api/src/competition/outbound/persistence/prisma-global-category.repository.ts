import { Inject, Injectable } from "@nestjs/common";
import {
  type GlobalCategoryCollection,
  globalCategoryCollectionSchema,
} from "@padel/schemas";

import type { DivisionName as PrismaDivisionName } from "../../../generated/prisma/enums.js";
import { PrismaService } from "../../../prisma/prisma.service.js";
import {
  type GlobalCategoryRepository,
  GlobalCategoryRepositoryToken,
} from "../../application/ports/global-category-repository.js";
import type { GlobalCategory } from "../../domain/global-category.js";

function divisionsToDb(divisions: string[]): PrismaDivisionName[] {
  return divisions.map((d) => {
    if (d === "masculino") return "masculino" as PrismaDivisionName;
    if (d === "femenino") return "femenino" as PrismaDivisionName;
    return "mixto" as PrismaDivisionName;
  });
}

function divisionsFromDb(divisions: PrismaDivisionName[]): string[] {
  return divisions as string[];
}

@Injectable()
export class PrismaGlobalCategoryRepository
  implements GlobalCategoryRepository
{
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async nextId() {
    return crypto.randomUUID();
  }

  async create(category: GlobalCategory) {
    const response = category.toResponse();

    await this.prisma.globalCategory.create({
      data: {
        id: response.id,
        name: response.name,
        shortCode: response.shortCode,
        description: response.description,
        skillLevel: response.skillLevel,
        color: response.color,
        divisions: divisionsToDb(response.divisions),
        minRanking: response.minRanking,
        maxRanking: response.maxRanking,
        requiresOfficialRanking: response.requiresOfficialRanking,
        allowCategoryChange: response.allowCategoryChange,
        isActive: response.isActive,
      },
    });
  }

  async listAll(): Promise<GlobalCategoryCollection> {
    const rows = await this.prisma.globalCategory.findMany({
      orderBy: { skillLevel: "asc" },
    });

    const items = rows.map((row) => ({
      id: row.id,
      name: row.name,
      shortCode: row.shortCode,
      description: row.description,
      skillLevel: row.skillLevel,
      color: row.color,
      divisions: divisionsFromDb(row.divisions),
      minRanking: row.minRanking,
      maxRanking: row.maxRanking,
      requiresOfficialRanking: row.requiresOfficialRanking,
      allowCategoryChange: row.allowCategoryChange,
      isActive: row.isActive,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));

    return globalCategoryCollectionSchema.parse(items);
  }
}

export const prismaGlobalCategoryRepositoryProvider = {
  provide: GlobalCategoryRepositoryToken,
  useClass: PrismaGlobalCategoryRepository,
};
