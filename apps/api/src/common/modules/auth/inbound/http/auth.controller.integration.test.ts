import "reflect-metadata";

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { PrismaService } from "../../../../../prisma/prisma.service.js";

const databaseUrl = process.env.DATABASE_URL;
const canRunDatabaseTests = Boolean(databaseUrl);
const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../../../..",
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

describe.skipIf(!canRunDatabaseTests)("AuthController integration", () => {
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

    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.verification.deleteMany();

    const { createApp } = await import("../../../../../main.js");

    app = await createApp();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    await prisma?.$disconnect();
  });

  it("creates a persisted auth session and reads it back through Better Auth", async () => {
    const agent = request.agent(app.getHttpServer());
    const email = `auth-${randomUUID()}@example.com`;

    const signUpResponse = await agent
      .post("/auth/sign-up/email")
      .set("origin", "http://localhost:3000")
      .send({
        name: "Auth Test User",
        email,
        password: "password-1234",
      })
      .expect(200);

    expect(signUpResponse.body).toMatchObject({
      user: {
        email,
        name: "Auth Test User",
        emailVerified: false,
      },
    });
    expect(signUpResponse.headers["set-cookie"]).toBeDefined();

    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      include: {
        accounts: true,
        sessions: true,
      },
    });

    expect(user.accounts).toHaveLength(1);
    expect(user.accounts[0]).toMatchObject({
      providerId: "credential",
      accountId: user.id,
    });
    expect(user.sessions).toHaveLength(1);

    const sessionResponse = await agent.get("/auth/get-session").expect(200);

    expect(sessionResponse.body).toMatchObject({
      user: {
        id: user.id,
        email,
        name: "Auth Test User",
      },
      session: {
        userId: user.id,
      },
    });
  });
});
