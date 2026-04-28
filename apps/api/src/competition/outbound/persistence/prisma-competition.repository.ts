import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "../../../prisma/prisma.service.js";
import type { CompetitionRepository } from "../../application/ports/competition-repository.js";
import type { Competition } from "../../domain/competition.js";

@Injectable()
export class PrismaCompetitionRepository implements CompetitionRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async nextId() {
    return crypto.randomUUID();
  }

  async create(competition: Competition) {
    const row = competition.toPersistence();

    await this.prisma.competition.create({
      data: {
        id: row.id,
        title: row.title,
        format: row.format === "round-robin" ? "round_robin" : row.format,
        startsAt: row.startsAt,
        endsAt: row.endsAt,
        ownerId: row.ownerId,
        status: row.status,
      },
    });
  }
}
