import { Inject, Injectable } from "@nestjs/common";
import { categoryCollectionSchema } from "@padel/schemas";

import { PrismaService } from "../../../prisma/prisma.service.js";
import type { CategoryRepository } from "../../application/ports/category-repository.js";
import { Category } from "../../domain/category.js";

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async nextId() {
    return crypto.randomUUID();
  }

  async create(category: Category) {
    const row = category.toPersistence();

    await this.prisma.category.create({
      data: {
        id: row.id,
        competitionId: row.competitionId,
        label: row.label,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
    });
  }

  async listByCompetitionId(competitionId: string) {
    const categories = await this.prisma.category.findMany({
      where: { competitionId },
      orderBy: [{ createdAt: "asc" }],
    });

    return categoryCollectionSchema.parse(
      categories.map((row) => ({
        id: row.id,
        competitionId: row.competitionId,
        label: row.label,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })),
    );
  }

  async findById(id: string) {
    const row = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!row) {
      return null;
    }

    return Category.restore({
      id: row.id,
      competitionId: row.competitionId,
      label: row.label,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  async update(category: Category) {
    const row = category.toPersistence();

    await this.prisma.category.update({
      where: { id: row.id },
      data: {
        label: row.label,
        updatedAt: row.updatedAt,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
