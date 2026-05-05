import { Inject, Injectable } from "@nestjs/common";
import { competitionOverviewCollectionSchema } from "@padel/schemas";

import type { CompetitionFormat as PrismaCompetitionFormat } from "../../../generated/prisma/enums.js";
import { PrismaService } from "../../../prisma/prisma.service.js";
import type { CompetitionRepository } from "../../application/ports/competition-repository.js";
import type { CompetitionFormat } from "../../domain/competition-format.js";
import type { CompetitionStatus } from "../../domain/competition-status.js";
import { Competition } from "../../domain/competition.js";
import { mapCompetitionOverviewRow } from "./competition-overview.mapper.js";

function formatToDb(format: string): PrismaCompetitionFormat {
  return format === "round-robin"
    ? "round_robin"
    : (format as PrismaCompetitionFormat);
}

function formatFromDb(format: string): CompetitionFormat {
  return format === "round_robin"
    ? "round-robin"
    : (format as CompetitionFormat);
}

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
        description: row.description,
        format: formatToDb(row.format),
        startsAt: row.startsAt,
        endsAt: row.endsAt,
        regStartsAt: row.regStartsAt,
        regEndsAt: row.regEndsAt,
        maxTeams: row.maxTeams,
        pricePerTeam: row.pricePerTeam,
        isPublic: row.isPublic,
        requiresApproval: row.requiresApproval,
        hasWaitlist: row.hasWaitlist,
        groupCount: row.groupCount,
        teamsPerGroup: row.teamsPerGroup,
        setsToWin: row.setsToWin,
        gamesPerSet: row.gamesPerSet,
        tiebreakPoints: row.tiebreakPoints,
        goldenPoint: row.goldenPoint,
        matchDurationMinutes: row.matchDurationMinutes,
        firstMatchTime: row.firstMatchTime,
        lastMatchTime: row.lastMatchTime,
        breakBetweenMatchesMinutes: row.breakBetweenMatchesMinutes,
        autoGenerateSchedule: row.autoGenerateSchedule,
        earlyBirdDiscount: row.earlyBirdDiscount,
        isFreeEntry: row.isFreeEntry,
        ownerId: row.ownerId,
        status: row.status,
        courts: {
          create: row.courts.map((court) => ({
            name: court.name,
            type: court.type,
            isSelected: true,
          })),
        },
        prizes: {
          create: row.prizes.map((prize) => ({
            place: prize.place,
            amount: prize.amount,
          })),
        },
      },
    });
  }

  async save(competition: Competition) {
    const row = competition.toPersistence();

    await this.prisma.competition.update({
      where: { id: row.id },
      data: {
        title: row.title,
        description: row.description,
        format: formatToDb(row.format),
        startsAt: row.startsAt,
        endsAt: row.endsAt,
        regStartsAt: row.regStartsAt,
        regEndsAt: row.regEndsAt,
        maxTeams: row.maxTeams,
        pricePerTeam: row.pricePerTeam,
        isPublic: row.isPublic,
        requiresApproval: row.requiresApproval,
        hasWaitlist: row.hasWaitlist,
        groupCount: row.groupCount,
        teamsPerGroup: row.teamsPerGroup,
        setsToWin: row.setsToWin,
        gamesPerSet: row.gamesPerSet,
        tiebreakPoints: row.tiebreakPoints,
        goldenPoint: row.goldenPoint,
        matchDurationMinutes: row.matchDurationMinutes,
        firstMatchTime: row.firstMatchTime,
        lastMatchTime: row.lastMatchTime,
        breakBetweenMatchesMinutes: row.breakBetweenMatchesMinutes,
        autoGenerateSchedule: row.autoGenerateSchedule,
        earlyBirdDiscount: row.earlyBirdDiscount,
        isFreeEntry: row.isFreeEntry,
        ownerId: row.ownerId,
        status: row.status,
      },
    });
  }

  async listOverview() {
    const competitions = await this.prisma.competition.findMany({
      orderBy: [{ startsAt: "asc" }, { createdAt: "asc" }],
      include: {
        _count: {
          select: {
            categories: true,
            divisions: true,
            registrations: true,
            prizes: true,
          },
        },
        categories: {
          select: {
            label: true,
          },
        },
        prizes: {
          select: {
            amount: true,
          },
        },
      },
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
      competitions
        .map((competition) => {
          const owner = ownersById.get(competition.ownerId);

          if (!owner) {
            return null;
          }

          const prizePool = competition.prizes.reduce(
            (sum, prize) => sum + prize.amount,
            0,
          );

          const categoryNames = competition.categories.map((c) => c.label);

          return mapCompetitionOverviewRow({
            id: competition.id,
            title: competition.title,
            format: competition.format,
            status: competition.status,
            startsAt: competition.startsAt,
            endsAt: competition.endsAt,
            owner,
            categoryCount: competition._count.categories,
            divisionCount: competition._count.divisions,
            registrationCount: competition._count.registrations,
            prizePool,
            categoryNames,
          });
        })
        .filter((row): row is NonNullable<typeof row> => row !== null),
    );
  }

  async findById(id: string) {
    const row = await this.prisma.competition.findUnique({
      where: { id },
      include: {
        courts: true,
        prizes: true,
      },
    });

    if (!row) {
      return null;
    }

    return Competition.restore({
      id: row.id,
      title: row.title,
      description: row.description,
      format: formatFromDb(row.format),
      startsAt: row.startsAt.toISOString(),
      endsAt: row.endsAt.toISOString(),
      regStartsAt: row.regStartsAt?.toISOString() ?? null,
      regEndsAt: row.regEndsAt?.toISOString() ?? null,
      maxTeams: row.maxTeams,
      pricePerTeam: row.pricePerTeam,
      isPublic: row.isPublic,
      requiresApproval: row.requiresApproval,
      hasWaitlist: row.hasWaitlist,
      groupCount: row.groupCount,
      teamsPerGroup: row.teamsPerGroup,
      setsToWin: row.setsToWin,
      gamesPerSet: row.gamesPerSet,
      tiebreakPoints: row.tiebreakPoints,
      goldenPoint: row.goldenPoint,
      matchDurationMinutes: row.matchDurationMinutes,
      firstMatchTime: row.firstMatchTime,
      lastMatchTime: row.lastMatchTime,
      breakBetweenMatchesMinutes: row.breakBetweenMatchesMinutes,
      autoGenerateSchedule: row.autoGenerateSchedule,
      earlyBirdDiscount: row.earlyBirdDiscount,
      isFreeEntry: row.isFreeEntry,
      ownerId: row.ownerId,
      status: row.status as CompetitionStatus,
      courts: row.courts.map((court) => ({
        name: court.name,
        type: court.type,
      })),
      prizes: row.prizes.map((prize) => ({
        place: prize.place,
        amount: prize.amount,
      })),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  async findByIdWithCounts(id: string) {
    const row = await this.prisma.competition.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            categories: true,
            divisions: true,
          },
        },
        courts: true,
        prizes: true,
      },
    });

    if (!row) {
      return null;
    }

    return Competition.restore({
      id: row.id,
      title: row.title,
      description: row.description,
      format: formatFromDb(row.format),
      startsAt: row.startsAt.toISOString(),
      endsAt: row.endsAt.toISOString(),
      regStartsAt: row.regStartsAt?.toISOString() ?? null,
      regEndsAt: row.regEndsAt?.toISOString() ?? null,
      maxTeams: row.maxTeams,
      pricePerTeam: row.pricePerTeam,
      isPublic: row.isPublic,
      requiresApproval: row.requiresApproval,
      hasWaitlist: row.hasWaitlist,
      groupCount: row.groupCount,
      teamsPerGroup: row.teamsPerGroup,
      setsToWin: row.setsToWin,
      gamesPerSet: row.gamesPerSet,
      tiebreakPoints: row.tiebreakPoints,
      goldenPoint: row.goldenPoint,
      matchDurationMinutes: row.matchDurationMinutes,
      firstMatchTime: row.firstMatchTime,
      lastMatchTime: row.lastMatchTime,
      breakBetweenMatchesMinutes: row.breakBetweenMatchesMinutes,
      autoGenerateSchedule: row.autoGenerateSchedule,
      earlyBirdDiscount: row.earlyBirdDiscount,
      isFreeEntry: row.isFreeEntry,
      ownerId: row.ownerId,
      status: row.status as CompetitionStatus,
      courts: row.courts.map((court) => ({
        name: court.name,
        type: court.type,
      })),
      prizes: row.prizes.map((prize) => ({
        place: prize.place,
        amount: prize.amount,
      })),
      categoryCount: row._count.categories,
      divisionCount: row._count.divisions,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }
}
