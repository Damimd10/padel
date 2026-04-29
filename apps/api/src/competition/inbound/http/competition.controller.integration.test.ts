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

describe.skipIf(!canRunDatabaseTests)(
  "CompetitionController integration",
  () => {
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

    it("rejects unauthenticated competition creation requests", async () => {
      await request(app.getHttpServer())
        .post("/competitions")
        .send({
          title: "Protected Open",
          format: "elimination",
          startsAt: "2026-05-10T10:00:00.000Z",
          endsAt: "2026-05-12T18:00:00.000Z",
        })
        .expect(401)
        .expect(({ body }: { body: unknown }) => {
          expect(body).toMatchObject({
            statusCode: 401,
            message: "Unauthorized",
            path: "/competitions",
          });
        });
    });

    it("creates a competition for the authenticated user without requiring ownerId in the request", async () => {
      const agent = request.agent(app.getHttpServer());
      const email = `competition-${randomUUID()}@example.com`;

      const signUpResponse = await agent
        .post("/auth/sign-up/email")
        .set("origin", "http://localhost:3000")
        .send({
          name: "Competition Test User",
          email,
          password: "password-1234",
        })
        .expect(200);

      const authenticatedUserId = signUpResponse.body.user.id as string;

      const response = await agent
        .post("/competitions")
        .send({
          title: "Protected Open",
          format: "elimination",
          startsAt: "2026-05-10T10:00:00.000Z",
          endsAt: "2026-05-12T18:00:00.000Z",
        })
        .expect(201);

      expect(response.body).toMatchObject({
        title: "Protected Open",
        format: "elimination",
        ownerId: authenticatedUserId,
        status: "draft",
      });

      const competition = await prisma.competition.findUniqueOrThrow({
        where: { id: response.body.id as string },
      });

      expect(competition).toMatchObject({
        title: "Protected Open",
        ownerId: authenticatedUserId,
        status: "draft",
      });
    });
  },
);
