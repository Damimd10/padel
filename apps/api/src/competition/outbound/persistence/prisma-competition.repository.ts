import { Inject, Injectable } from "@nestjs/common";
import { competitionOverviewCollectionSchema } from "@padel/schemas";

import { PrismaService } from "../../../prisma/prisma.service.js";
import type { CompetitionRepository } from "../../application/ports/competition-repository.js";
import type { Competition } from "../../domain/competition.js";
import { mapCompetitionOverviewRow } from "./competition-overview.mapper.js";

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

  async listOverview() {
    const competitions = await this.prisma.competition.findMany({
      orderBy: [{ startsAt: "asc" }, { createdAt: "asc" }],
    });

    const ownerIds = [...new Set(competitions.map(({ ownerId }) => ownerId))];
    const owners = await this.prisma.user.findMany({
      where: {
        id: {
          in: ownerIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    const ownersById = new Map(owners.map((owner) => [owner.id, owner]));

    return competitionOverviewCollectionSchema.parse(
      competitions.map((competition) => {
        const owner = ownersById.get(competition.ownerId);

        if (!owner) {
          throw new Error(
            `Competition owner context is missing for ${competition.id}.`,
          );
        }

        return mapCompetitionOverviewRow({
          id: competition.id,
          title: competition.title,
          format: competition.format,
          status: competition.status,
          startsAt: competition.startsAt,
          endsAt: competition.endsAt,
          owner,
        });
      }),
    );
  }
}
