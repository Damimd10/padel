import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "../../../prisma/prisma.service.js";
import type { MatchRepository } from "../../application/ports/match-repository.js";
import type { MatchStatus } from "../../domain/match-status.js";
import { Match } from "../../domain/match.js";

@Injectable()
export class PrismaMatchRepository implements MatchRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async nextId() {
    return crypto.randomUUID();
  }

  async create(match: Match) {
    const row = match.toPersistence();

    await this.prisma.match.create({
      data: {
        id: row.id,
        competitionId: row.competitionId,
        registrationAId: row.registrationAId,
        registrationBId: row.registrationBId,
        status: row.status,
        scheduledAt: row.scheduledAt ? new Date(row.scheduledAt) : null,
        scoreA: row.scoreA,
        scoreB: row.scoreB,
      },
    });
  }

  async save(match: Match) {
    const row = match.toPersistence();

    await this.prisma.match.update({
      where: { id: row.id },
      data: {
        competitionId: row.competitionId,
        registrationAId: row.registrationAId,
        registrationBId: row.registrationBId,
        status: row.status,
        scheduledAt: row.scheduledAt ? new Date(row.scheduledAt) : null,
        scoreA: row.scoreA,
        scoreB: row.scoreB,
      },
    });
  }

  async findByCompetition(competitionId: string) {
    const rows = await this.prisma.match.findMany({
      where: { competitionId },
      orderBy: [{ scheduledAt: "asc" }, { createdAt: "asc" }],
    });

    return rows.map((row) =>
      Match.restore({
        id: row.id,
        competitionId: row.competitionId,
        registrationAId: row.registrationAId,
        registrationBId: row.registrationBId,
        status: row.status as MatchStatus,
        scheduledAt: row.scheduledAt?.toISOString(),
        scoreA: row.scoreA ?? undefined,
        scoreB: row.scoreB ?? undefined,
      }),
    );
  }

  async findById(id: string) {
    const row = await this.prisma.match.findUnique({
      where: { id },
    });

    if (!row) {
      return null;
    }

    return Match.restore({
      id: row.id,
      competitionId: row.competitionId,
      registrationAId: row.registrationAId,
      registrationBId: row.registrationBId,
      status: row.status as MatchStatus,
      scheduledAt: row.scheduledAt?.toISOString(),
      scoreA: row.scoreA ?? undefined,
      scoreB: row.scoreB ?? undefined,
    });
  }
}
