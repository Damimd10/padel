import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { Competition } from "../src/competition/domain/competition.js";
import { PrismaCompetitionRepository } from "../src/competition/outbound/persistence/prisma-competition.repository.js";
import { PrismaService } from "../src/prisma/prisma/prisma.service.js";

const databaseUrl = process.env.DATABASE_URL;
const canRunDatabaseTests = Boolean(databaseUrl);

describe.skipIf(!canRunDatabaseTests)("PrismaCompetitionRepository", () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();

    await prisma
      .$executeRawUnsafe(`
      CREATE TYPE "CompetitionFormat" AS ENUM ('elimination', 'round_robin', 'league');
    `)
      .catch(() => undefined);

    await prisma
      .$executeRawUnsafe(`
      CREATE TYPE "CompetitionStatus" AS ENUM ('draft', 'open', 'closed');
    `)
      .catch(() => undefined);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Competition" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "format" "CompetitionFormat" NOT NULL,
        "startsAt" TIMESTAMPTZ NOT NULL,
        "endsAt" TIMESTAMPTZ NOT NULL,
        "ownerId" TEXT NOT NULL,
        "status" "CompetitionStatus" NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await prisma.competition.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("persists a competition row in PostgreSQL through Prisma", async () => {
    const repository = new PrismaCompetitionRepository(prisma);
    const competition = Competition.createDraft(
      {
        title: "Spring Classic",
        format: "league",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
      },
      randomUUID(),
    );

    await repository.create(competition);

    const row = await prisma.competition.findUniqueOrThrow({
      where: { id: competition.toResponse().id },
    });

    expect(row).toMatchObject({
      id: competition.toResponse().id,
      title: "Spring Classic",
      format: "league",
      ownerId: "owner-1",
      status: "draft",
    });
  });
});
