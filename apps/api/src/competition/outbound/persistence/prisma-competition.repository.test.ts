import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { PrismaService } from "../../../prisma/prisma.service.js";
import { Competition } from "../../domain/competition.js";
import { PrismaCompetitionRepository } from "./prisma-competition.repository.js";

const databaseUrl = process.env.DATABASE_URL;
const canRunDatabaseTests = Boolean(databaseUrl);
const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../../..",
);

function applyPrismaMigrations() {
  const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

  execFileSync(
    pnpmCommand,
    [
      "-w",
      "exec",
      "prisma",
      "migrate",
      "deploy",
      "--schema",
      "./apps/api/prisma/schema.prisma",
    ],
    {
      cwd: repositoryRoot,
      env: process.env,
      stdio: "inherit",
    },
  );
}

describe.skipIf(!canRunDatabaseTests)("PrismaCompetitionRepository", () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    applyPrismaMigrations();

    prisma = new PrismaService();
    await prisma.$connect();

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
