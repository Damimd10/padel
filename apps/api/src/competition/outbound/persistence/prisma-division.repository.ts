import { Inject, Injectable } from "@nestjs/common";
import { divisionCollectionSchema } from "@padel/schemas";

import { PrismaService } from "../../../prisma/prisma.service.js";
import type { DivisionRepository } from "../../application/ports/division-repository.js";
import { Division, type DivisionName } from "../../domain/division.js";

@Injectable()
export class PrismaDivisionRepository implements DivisionRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async nextId() {
    return crypto.randomUUID();
  }

  async create(division: Division) {
    const row = division.toPersistence();

    await this.prisma.division.create({
      data: {
        id: row.id,
        competitionId: row.competitionId,
        name: row.name,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
    });
  }

  async listByCompetitionId(competitionId: string) {
    const divisions = await this.prisma.division.findMany({
      where: { competitionId },
      orderBy: [{ createdAt: "asc" }],
    });

    return divisionCollectionSchema.parse(
      divisions.map((row) => ({
        id: row.id,
        competitionId: row.competitionId,
        name: row.name,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })),
    );
  }

  async findById(id: string) {
    const row = await this.prisma.division.findUnique({
      where: { id },
    });

    if (!row) {
      return null;
    }

    return Division.restore({
      id: row.id,
      competitionId: row.competitionId,
      name: row.name as DivisionName,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  async update(division: Division) {
    const row = division.toPersistence();

    await this.prisma.division.update({
      where: { id: row.id },
      data: {
        name: row.name,
        updatedAt: row.updatedAt,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.division.delete({
      where: { id },
    });
  }
}
