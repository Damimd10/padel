import "reflect-metadata";

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { PrismaService } from "../../../prisma/prisma.service.js";

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

describe.skipIf(!canRunDatabaseTests)("CategoryController integration", () => {
  let prisma: PrismaService;
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV ??= "test";
    process.env.BETTER_AUTH_SECRET ??= "test-secret";
    process.env.BETTER_AUTH_URL ??= "http://localhost:3000";
    process.env.LOG_LEVEL ??= "error";
    process.env.LOG_JSON ??= "true";
    process.env.API_RATE_LIMIT_MAX ??= "100";
    process.env.API_RATE_LIMIT_TTL_MS ??= "60000";

    applyPrismaMigrations();

    prisma = new PrismaService();
    await prisma.$connect();

    await prisma.category.deleteMany();
    await prisma.competition.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.verification.deleteMany();

    const { createApp } = await import("../../../main.js");

    app = await createApp();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    await prisma?.$disconnect();
  });

  it("rejects unauthenticated category creation", async () => {
    const competitionId = randomUUID();

    await request(app.getHttpServer())
      .post(`/competitions/${competitionId}/categories`)
      .send({ label: "Segunda" })
      .expect(401);
  });

  it("creates, lists, updates, and deletes a category for an authenticated user", async () => {
    const agent = request.agent(app.getHttpServer());
    const email = `category-test-${randomUUID()}@example.com`;

    await agent
      .post("/auth/sign-up/email")
      .set("origin", "http://localhost:3000")
      .send({
        name: "Category Test User",
        email,
        password: "password-1234",
      })
      .expect(200);

    const competitionResponse = await agent.post("/competitions").send({
      title: "Category Test Competition",
      format: "elimination",
      startsAt: "2026-05-10T10:00:00.000Z",
      endsAt: "2026-05-12T18:00:00.000Z",
    });

    const competitionId = competitionResponse.body.id as string;

    const createResponse = await agent
      .post(`/competitions/${competitionId}/categories`)
      .send({ label: "Segunda" })
      .expect(201);

    const categoryId = createResponse.body.id as string;
    expect(createResponse.body).toMatchObject({
      competitionId,
      label: "Segunda",
    });

    const listResponse = await agent
      .get(`/competitions/${competitionId}/categories`)
      .expect(200);

    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0]).toMatchObject({ label: "Segunda" });

    await agent
      .patch(`/competitions/${competitionId}/categories/${categoryId}`)
      .send({ label: "Segunda A" })
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({ label: "Segunda A" });
      });

    await agent
      .delete(`/competitions/${competitionId}/categories/${categoryId}`)
      .expect(204);

    const afterDelete = await agent
      .get(`/competitions/${competitionId}/categories`)
      .expect(200);

    expect(afterDelete.body).toHaveLength(0);
  });
});
